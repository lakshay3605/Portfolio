from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"
INSTRUCTION_LAYERS_FILE = "instruction_layers.yaml"
DEFAULT_INSTRUCTION_LAYERS = ("system_prompt.md", "response_style.md")
DEFAULT_KNOWLEDGE_WRAPPER = "knowledge_wrapper.md"


@dataclass(frozen=True)
class _PromptCacheEntry:
    content: str
    mtime: float


class PromptService:
    """Loads prompt files from disk with optional dev hot-reload.

    Extension points:
    - Add layers in instruction_layers.yaml (few_shot_examples.md, interview_mode.md, etc.)
    - Versioned prompts per environment
    - Dynamic prompt assembly with RAG context blocks via PromptBuilder
    """

    def __init__(
        self,
        prompts_dir: Path = PROMPTS_DIR,
        *,
        reload_on_change: bool = False,
    ) -> None:
        self._prompts_dir = prompts_dir
        self._reload_on_change = reload_on_change
        self._cache: dict[str, _PromptCacheEntry] = {}
        self._layer_config_mtime: float | None = None
        self._instruction_layers: tuple[str, ...] = DEFAULT_INSTRUCTION_LAYERS
        self._knowledge_wrapper_file = DEFAULT_KNOWLEDGE_WRAPPER

    def get_instruction_layers(self) -> tuple[str, ...]:
        self._refresh_layer_config()
        return self._instruction_layers

    def preload_instruction_layers(self) -> None:
        for filename in self.get_instruction_layers():
            self.load_prompt(filename)
        self.load_knowledge_wrapper()
        logger.info("Preloaded prompt layers: %s", list(self.get_instruction_layers()))

    def load_system_prompt(self) -> str:
        return self.load_prompt("system_prompt.md")

    def load_response_style(self) -> str:
        return self.load_prompt("response_style.md")

    def load_knowledge_wrapper(self) -> str:
        self._refresh_layer_config()
        return self.load_prompt(self._knowledge_wrapper_file)

    def load_prompt(self, filename: str) -> str:
        prompt_path = self._prompts_dir / filename

        if not prompt_path.is_file():
            raise FileNotFoundError(f"Prompt file not found: {prompt_path}")

        if self._should_reload(filename, prompt_path):
            content = prompt_path.read_text(encoding="utf-8").strip()

            if not content:
                raise ValueError(f"Prompt file is empty: {prompt_path}")

            self._cache[filename] = _PromptCacheEntry(
                content=content,
                mtime=prompt_path.stat().st_mtime,
            )

        return self._cache[filename].content

    def _should_reload(self, filename: str, prompt_path: Path) -> bool:
        if filename not in self._cache:
            return True

        if not self._reload_on_change:
            return False

        return prompt_path.stat().st_mtime != self._cache[filename].mtime

    def _refresh_layer_config(self) -> None:
        config_path = self._prompts_dir / INSTRUCTION_LAYERS_FILE

        if not config_path.is_file():
            self._instruction_layers = DEFAULT_INSTRUCTION_LAYERS
            self._knowledge_wrapper_file = DEFAULT_KNOWLEDGE_WRAPPER
            return

        config_mtime = config_path.stat().st_mtime
        if self._layer_config_mtime == config_mtime:
            return

        raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
        layers = raw.get("instruction_layers") or list(DEFAULT_INSTRUCTION_LAYERS)
        wrapper = raw.get("knowledge_wrapper") or DEFAULT_KNOWLEDGE_WRAPPER

        self._instruction_layers = tuple(str(layer).strip() for layer in layers if str(layer).strip())
        self._knowledge_wrapper_file = str(wrapper).strip() or DEFAULT_KNOWLEDGE_WRAPPER
        self._layer_config_mtime = config_mtime

        if not self._instruction_layers:
            raise ValueError(f"No instruction layers configured in: {config_path}")
