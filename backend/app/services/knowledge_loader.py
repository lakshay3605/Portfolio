from __future__ import annotations



import logging

import re

from dataclasses import dataclass

from pathlib import Path

from typing import Iterable, Sequence



from app.services.knowledge_layers_config import (

    DEFAULT_KNOWLEDGE_LAYERS_PATH,

    KnowledgeLayersConfig,

    PromptKnowledgeTier,

    load_knowledge_layers_config,

)



logger = logging.getLogger(__name__)



KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge"

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"



_EXAMPLE_HEADER = re.compile(r"^## Example:\s*(.+)$", re.MULTILINE)

_TAGS_LINE = re.compile(r"^Tags:\s*(.+)$", re.MULTILINE | re.IGNORECASE)

_WORD_BOUNDARY = re.compile(r"\b[\w'-]+\b")





@dataclass(frozen=True)

class KnowledgeDocument:

    """A single markdown knowledge file."""



    id: str

    filename: str

    relative_path: str

    category: str

    path: Path

    content: str





@dataclass(frozen=True)

class ConversationExample:

    example_id: str

    tags: tuple[str, ...]

    user_question: str

    lakshay_answer: str

    source_path: str



    def to_markdown(self) -> str:

        return (

            f"## Example: {self.example_id}\n\n"

            f"User:\n\n{self.user_question.strip()}\n\n"

            f"Lakshay:\n\n{self.lakshay_answer.strip()}"

        )





@dataclass(frozen=True)

class KnowledgeLayerContext:

    wrapper: str

    content: str





@dataclass(frozen=True)

class KnowledgePromptContext:

    """Ordered knowledge layers for PromptBuilder."""



    layers: tuple[KnowledgeLayerContext, ...]





@dataclass

class _KnowledgeCache:

    documents: tuple[KnowledgeDocument, ...]

    file_mtimes: dict[str, float]

    conversation_examples: tuple[ConversationExample, ...]





class KnowledgeLoader:

    """Recursively loads markdown knowledge with category metadata.



    Folder layout:

        facts/        — source of truth (about, contact, experience, skills, projects/)

        personality/  — values, philosophy, biography, humor, opinions

        training/     — behavior examples (parsed, not injected as raw documents)

        stories/      — personal narratives



    Extension points:

    - Select by id, category, or relative path via get_documents()

    - Retrieve a single file: get_documents(paths=["training/recruiter.md"])

    - Retrieve a folder: get_documents(paths=["facts/projects/"])

    - Swap training example selection for embedding retrieval / RAG

    """



    def __init__(

        self,

        knowledge_dir: Path = KNOWLEDGE_DIR,

        *,

        reload_on_change: bool = False,

        layers_config_path: Path = DEFAULT_KNOWLEDGE_LAYERS_PATH,

    ) -> None:

        self._knowledge_dir = knowledge_dir

        self._reload_on_change = reload_on_change

        self._layers_config_path = layers_config_path

        self._layers_config = load_knowledge_layers_config(layers_config_path)

        self._cache: _KnowledgeCache | None = None

        self._wrapper_cache: dict[str, str] = {}



    def load_all(self) -> tuple[KnowledgeDocument, ...]:

        if self._should_reload():

            self._cache = self._load_from_disk()

            relative_paths = [document.relative_path for document in self._cache.documents]

            logger.info(

                "Loaded %s knowledge documents.\n%s",

                len(relative_paths),

                "\n".join(relative_paths),

            )

            if self._cache.conversation_examples:

                logger.info("Parsed %s training examples", len(self._cache.conversation_examples))

        assert self._cache is not None

        return self._cache.documents



    def get_documents(

        self,

        ids: Iterable[str] | None = None,

        *,

        category: str | None = None,

        paths: Iterable[str] | None = None,

    ) -> tuple[KnowledgeDocument, ...]:

        """Return documents by id, category, or relative path (file or folder prefix)."""

        if paths is not None:

            return self._get_documents_by_paths(paths)



        if category is not None:

            return tuple(

                document

                for document in self.load_all()

                if document.category == category and not self._is_training_source(document)

            )



        if ids is not None:

            ordered_ids = list(dict.fromkeys(ids))

            by_id = {document.id: document for document in self.load_all()}



            missing = [file_id for file_id in ordered_ids if file_id not in by_id]

            if missing:

                logger.warning("Unknown knowledge files requested: %s", missing)



            return tuple(by_id[file_id] for file_id in ordered_ids if file_id in by_id)



        return self._content_documents()



    def build_context(self, documents: Sequence[KnowledgeDocument] | None = None) -> str:

        docs = list(documents if documents is not None else self._content_documents())



        if not docs:

            return ""



        sections: list[str] = []

        for document in docs:

            title = document.id.replace("/", " — ").replace("_", " ").title()

            sections.append(f"## {title}\n\n{document.content.strip()}")



        return "\n\n".join(sections)



    def build_prompt_context(

        self,

        routed_file_ids: Iterable[str],

        *,

        user_message: str | None = None,

    ) -> KnowledgePromptContext:

        self.load_all()
        self._refresh_layers_config()

        layers: list[KnowledgeLayerContext] = []

        layers.extend(self._build_priority_layers(user_message=user_message))



        routed_documents = [

            document

            for document in self.get_documents(routed_file_ids)

            if not self._is_training_source(document)

        ]



        used_ids: set[str] = set()

        for tier in self._layers_config.prompt_knowledge_order:

            tier_docs = self._documents_for_tier(tier, routed_documents, used_ids)

            if not tier_docs:

                continue



            content = self.build_context(tier_docs)

            if not content.strip():

                continue



            wrapper_name = self._wrapper_for_tier(tier)

            layers.append(

                KnowledgeLayerContext(

                    wrapper=self._load_wrapper(wrapper_name),

                    content=content.strip(),

                )

            )

            used_ids.update(document.id for document in tier_docs)



        return KnowledgePromptContext(layers=tuple(layers))



    def _get_documents_by_paths(

        self,

        paths: Iterable[str],

    ) -> tuple[KnowledgeDocument, ...]:

        all_documents = self.load_all()

        matched: list[KnowledgeDocument] = []

        seen_ids: set[str] = set()



        for raw_path in paths:

            query = raw_path.strip().replace("\\", "/").rstrip("/")

            if not query:

                continue



            for document in all_documents:

                if document.id in seen_ids:

                    continue

                if self._matches_path_query(document, query):

                    matched.append(document)

                    seen_ids.add(document.id)



        return tuple(matched)



    @classmethod

    def _matches_path_query(cls, document: KnowledgeDocument, query: str) -> bool:

        relative = document.relative_path

        if query.endswith(".md"):

            return relative == query



        if relative == f"{query}.md":

            return True



        return relative.startswith(f"{query}/")



    def _content_documents(self) -> tuple[KnowledgeDocument, ...]:

        return tuple(

            document

            for document in self.load_all()

            if not self._is_training_source(document)

        )



    def _is_training_source(self, document: KnowledgeDocument) -> bool:

        return document.category in self._layers_config.training_source_categories



    def _wrapper_for_tier(self, tier: PromptKnowledgeTier) -> str:

        if tier.tier_type == "category" and tier.name:

            return self._layers_config.category_wrappers.get(

                tier.name,

                self._layers_config.general_wrapper,

            )



        return self._layers_config.general_wrapper



    def _build_priority_layers(

        self,

        *,

        user_message: str | None,

    ) -> list[KnowledgeLayerContext]:

        if not self._layers_config.priority_layers:

            return []



        layers: list[KnowledgeLayerContext] = []



        for layer in self._layers_config.priority_layers:

            if layer.category in self._layers_config.training_source_categories:

                content = self._compose_training_examples_content(

                    user_message=user_message,

                    max_examples=layer.max_examples,

                )

            elif layer.document_id:

                document = next(

                    (doc for doc in self.load_all() if doc.id == layer.document_id),

                    None,

                )

                content = document.content.strip() if document else ""

            elif layer.category:

                content = self.build_context(self.get_documents(category=layer.category))

            else:

                content = ""



            if not content.strip():

                continue



            wrapper = self._load_wrapper(layer.wrapper) if layer.wrapper else ""

            layers.append(

                KnowledgeLayerContext(

                    wrapper=wrapper.strip(),

                    content=content.strip(),

                )

            )



        return layers



    def _compose_training_examples_content(

        self,

        *,

        user_message: str | None,

        max_examples: int,

    ) -> str:

        assert self._cache is not None

        examples = self._cache.conversation_examples

        if not examples:

            return ""



        selected = self._select_conversation_examples(

            user_message or "",

            examples,

            max_examples=max_examples,

        )

        return "\n\n---\n\n".join(example.to_markdown() for example in selected)



    def _documents_for_tier(

        self,

        tier: PromptKnowledgeTier,

        routed_documents: Sequence[KnowledgeDocument],

        used_ids: set[str],

    ) -> tuple[KnowledgeDocument, ...]:

        available = [document for document in routed_documents if document.id not in used_ids]



        if tier.tier_type == "category" and tier.name:

            matched = [document for document in available if document.category == tier.name]

            return tuple(matched)



        if tier.tier_type == "document" and tier.document_id:

            matched = [document for document in available if document.id == tier.document_id]

            if matched:

                return tuple(matched)

            matched = [

                document

                for document in available

                if document.path.stem == tier.document_id

                or document.id.endswith(f"/{tier.document_id}")

            ]

            return tuple(matched)



        if tier.tier_type == "remaining":

            return tuple(available)



        return ()



    def _load_all_training_examples(self) -> tuple[ConversationExample, ...]:

        examples_by_id: dict[str, ConversationExample] = {}



        for path in sorted(self._iter_markdown_files()):

            relative_path = path.relative_to(self._knowledge_dir).as_posix()

            category = path.relative_to(self._knowledge_dir).parts[0]

            if category not in self._layers_config.training_source_categories:

                continue



            for example in self.parse_conversation_examples(

                path.read_text(encoding="utf-8"),

                source_path=relative_path,

            ):

                examples_by_id[example.example_id] = example



        return tuple(examples_by_id.values())



    @classmethod

    def parse_conversation_examples(

        cls,

        content: str,

        *,

        source_path: str = "",

    ) -> tuple[ConversationExample, ...]:

        blocks = re.split(r"\n---\n", content)

        examples: list[ConversationExample] = []



        for block in blocks:

            block = block.strip()

            if not block:

                continue



            header = _EXAMPLE_HEADER.search(block)

            if not header:

                continue



            example_id = header.group(1).strip()

            tags_match = _TAGS_LINE.search(block)

            tags = cls._parse_tags(tags_match.group(1) if tags_match else "")



            user_question = cls._extract_labeled_block(block, label="User")

            lakshay_answer = cls._extract_labeled_block(block, label="Lakshay")

            if not user_question or not lakshay_answer:

                continue



            examples.append(

                ConversationExample(

                    example_id=example_id,

                    tags=tags,

                    user_question=user_question,

                    lakshay_answer=lakshay_answer,

                    source_path=source_path,

                )

            )



        return tuple(examples)



    @staticmethod

    def _extract_labeled_block(content: str, *, label: str) -> str:

        next_label = "Lakshay" if label.lower() == "user" else "User"

        pattern = re.compile(

            rf"(?:^\*\*{re.escape(label)}:\*\*|^{re.escape(label)}:)\s*\n+(.*?)"

            rf"(?=\n(?:\*\*)?{re.escape(next_label)}:|\Z)",

            re.MULTILINE | re.DOTALL | re.IGNORECASE,

        )

        match = pattern.search(content)

        if not match:

            return ""

        return match.group(1).strip()



    @classmethod

    def _select_conversation_examples(

        cls,

        user_message: str,

        examples: Sequence[ConversationExample],

        *,

        max_examples: int,

    ) -> tuple[ConversationExample, ...]:

        if max_examples <= 0 or len(examples) <= max_examples:

            return tuple(examples)



        normalized_message = user_message.lower().strip()

        if not normalized_message:

            return tuple(examples[:max_examples])



        message_tokens = cls._tokenize(normalized_message)

        scored: list[tuple[int, ConversationExample]] = []



        for example in examples:

            score = cls._score_conversation_example(

                normalized_message,

                message_tokens,

                example,

            )

            scored.append((score, example))



        scored.sort(key=lambda item: (-item[0], item[1].example_id))

        top_matches = [example for score, example in scored if score > 0][:max_examples]



        if top_matches:

            return tuple(top_matches)



        return tuple(example for _, example in scored[:max_examples])



    @classmethod

    def _score_conversation_example(

        cls,

        normalized_message: str,

        message_tokens: set[str],

        example: ConversationExample,

    ) -> int:

        score = 0

        example_id_text = example.example_id.replace("-", " ").lower()

        user_question = example.user_question.lower()



        for tag in example.tags:

            tag_normalized = tag.lower().strip()

            if not tag_normalized:

                continue

            if tag_normalized in normalized_message:

                score += 4

            elif " " not in tag_normalized and tag_normalized in message_tokens:

                score += 3



        if user_question in normalized_message or normalized_message in user_question:

            score += 6



        for token in message_tokens:

            if len(token) < 3:

                continue

            if token in user_question:

                score += 1

            if token in example_id_text:

                score += 1



        return score



    @staticmethod

    def _parse_tags(raw_tags: str) -> tuple[str, ...]:

        return tuple(tag.strip() for tag in raw_tags.split(",") if tag.strip())



    @classmethod

    def _tokenize(cls, text: str) -> set[str]:

        return set(_WORD_BOUNDARY.findall(text))



    @staticmethod

    def _document_id(relative_path: Path) -> str:

        return relative_path.with_suffix("").as_posix()



    def _load_wrapper(self, filename: str) -> str:

        if not filename:

            return ""



        if filename in self._wrapper_cache and not self._reload_on_change:

            return self._wrapper_cache[filename]



        wrapper_path = PROMPTS_DIR / filename

        if not wrapper_path.is_file():

            raise FileNotFoundError(f"Knowledge wrapper not found: {wrapper_path}")



        content = wrapper_path.read_text(encoding="utf-8").strip()

        self._wrapper_cache[filename] = content

        return content



    def _refresh_layers_config(self) -> None:

        if not self._layers_config_path.is_file():

            return



        config_mtime = self._layers_config_path.stat().st_mtime

        cached_mtime = getattr(self, "_layers_config_mtime", None)

        if cached_mtime == config_mtime:

            return



        self._layers_config = load_knowledge_layers_config(self._layers_config_path)

        self._layers_config_mtime = config_mtime



    def _should_reload(self) -> bool:

        if self._cache is None:

            return True



        if not self._reload_on_change:

            return False



        return self._read_file_mtimes() != self._cache.file_mtimes



    def _iter_markdown_files(self) -> list[Path]:

        return sorted(

            path

            for path in self._knowledge_dir.rglob("*.md")

            if not any(

                path.name.startswith(prefix)

                for prefix in self._layers_config.ignore_filename_prefixes

            )

        )



    def _load_from_disk(self) -> _KnowledgeCache:

        if not self._knowledge_dir.is_dir():

            raise FileNotFoundError(f"Knowledge directory not found: {self._knowledge_dir}")



        markdown_files = self._iter_markdown_files()

        if not markdown_files:

            raise FileNotFoundError(f"No markdown files found under: {self._knowledge_dir}")



        documents: list[KnowledgeDocument] = []



        for path in markdown_files:

            content = path.read_text(encoding="utf-8").strip()

            if not content:

                raise ValueError(f"Knowledge file is empty: {path}")



            relative_path = path.relative_to(self._knowledge_dir)

            category = relative_path.parts[0] if len(relative_path.parts) > 1 else ""



            documents.append(

                KnowledgeDocument(

                    id=self._document_id(relative_path),

                    filename=path.name,

                    relative_path=relative_path.as_posix(),

                    category=category,

                    path=path,

                    content=content,

                )

            )



        conversation_examples = list(self._load_all_training_examples())



        return _KnowledgeCache(

            documents=tuple(documents),

            file_mtimes=self._read_file_mtimes(),

            conversation_examples=tuple(conversation_examples),

        )



    def _read_file_mtimes(self) -> dict[str, float]:

        if not self._knowledge_dir.is_dir():

            return {}



        return {str(path): path.stat().st_mtime for path in self._iter_markdown_files()}


