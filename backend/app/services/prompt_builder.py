from __future__ import annotations



from typing import Self



from app.services.knowledge_loader import KnowledgePromptContext

from app.services.prompt_service import PromptService





class PromptBuilder:

    """Assembles LLM instructions from modular prompt layers.



    Chat pipeline (user message is passed separately as user_input):

        system_prompt.md
        → response_style.md
        → training examples (training/)
        → personality → stories → facts
        → user message



    Configure instruction layers in prompts/instruction_layers.yaml.

    Configure knowledge order in config/knowledge_layers.yaml.

    """



    LAYER_SEPARATOR = "\n\n---\n\n"



    def __init__(self, prompt_service: PromptService) -> None:

        self._prompt_service = prompt_service

        self._parts: list[str] = []



    def reset(self) -> Self:

        self._parts = []

        return self



    def load_system_prompt(self) -> Self:

        layers = self._prompt_service.get_instruction_layers()

        if layers:

            self.load(layers[0])

        return self



    def load_response_style(self) -> Self:

        layers = self._prompt_service.get_instruction_layers()

        if len(layers) > 1:

            self.load(layers[1])

        return self



    def load_instruction_layers(self) -> Self:

        for filename in self._prompt_service.get_instruction_layers():

            self.load(filename)

        return self



    def load(self, filename: str) -> Self:

        self._parts.append(self._prompt_service.load_prompt(filename))

        return self



    def load_knowledge_context(self, context: KnowledgePromptContext) -> Self:

        for layer in context.layers:

            self._append_wrapped_layer(layer.wrapper, layer.content)

        return self



    def load_knowledge(self, knowledge_context: str) -> Self:

        context = knowledge_context.strip()

        if not context:

            return self



        wrapper = self._prompt_service.load_knowledge_wrapper()

        self._append_wrapped_layer(wrapper, context)

        return self



    def assemble_chat_instructions(self, knowledge_context: KnowledgePromptContext) -> str:

        return (

            self.reset()

            .load_instruction_layers()

            .load_knowledge_context(knowledge_context)

            .build_instructions()

        )



    def build_instructions(self) -> str:

        return self.LAYER_SEPARATOR.join(part.strip() for part in self._parts if part.strip())



    def _append_wrapped_layer(self, wrapper: str, content: str) -> None:

        if not content.strip():

            return



        if wrapper.strip():

            self._parts.append(f"{wrapper.strip()}\n\n{content.strip()}")

        else:

            self._parts.append(content.strip())


