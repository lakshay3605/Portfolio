"""One-time migration: reorganize knowledge/ folder and split conversation examples."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

KNOWLEDGE = Path(__file__).resolve().parents[1] / "knowledge"
CONVERSATIONS = KNOWLEDGE / "conversations"
STORIES = KNOWLEDGE / "stories"
PERSONAL = KNOWLEDGE / "personal"
PROJECTS = KNOWLEDGE / "projects"

PROJECT_MOVES = {
    "project_business_intelligence_assistant.md": PROJECTS / "business_intelligence.md",
    "project_jagrukmahila.md": PROJECTS / "jagrukmahila.md",
    "project_multi_tool_ai_agent.md": PROJECTS / "multi_tool_ai.md",
}

CONVERSATION_FILES = [
    "recruiter.md",
    "behavioral.md",
    "personality.md",
    "casual.md",
    "career_advice.md",
    "leadership.md",
    "biography.md",
    "opinions.md",
    "rapid_fire.md",
]

STORY_FILES = [
    "childhood.md",
    "school.md",
    "college.md",
    "hackathons.md",
    "internship.md",
    "funny_moments.md",
]

PERSONAL_FILES = [
    "hobbies.md",
    "favorites.md",
    "goals.md",
    "daily_life.md",
]

_EXAMPLE_SPLIT = re.compile(r"(?=^## Example:)", re.MULTILINE)

_CATEGORY_KEYWORDS: dict[str, tuple[str, ...]] = {
    "recruiter": ("hire", "hiring", "recruiter", "why-should-we-hire", "advice-for-recruiters", "contact-collaboration"),
    "behavioral": (
        "weakness",
        "failure",
        "pressure",
        "teamwork",
        "challenge",
        "stuck",
        "handling",
        "motivation",
        "work-ethic",
    ),
    "personality": ("personality", "describe-in-three", "what-makes-you-different", "humor", "communication-style"),
    "casual": ("aur-bhai", "kya-kar-raha", "momos", "casual", "hinglish", "bhai"),
    "career_advice": ("career-advice", "break-into-ai", "skills-to-invest", "how-you-learn", "stay-updated"),
    "leadership": (
        "leadership",
        "think-ai",
        "hacksphere",
        "mentoring",
        "community",
        "idealabx",
        "hackmart",
        "snapar",
    ),
    "biography": (
        "tell-me-about-yourself",
        "school",
        "childhood",
        "why-ai-ml",
        "five-year",
        "favorite-memory",
        "daily-life",
        "friends",
        "travel",
        "relationships",
        "gym",
        "cooking",
    ),
    "opinions": (
        "philosophy",
        "product-vs-demo",
        "ai-hype",
        "when-not-to-use",
        "core-values",
        "ownership",
        "money-and-internships",
        "investing",
        "why-ai",
        "engineering-philosophy",
        "how-you-pick",
        "personal-fears",
    ),
    "rapid_fire": ("describe-in-three-words", "strengths", "dream-role"),
}


def _classify_example(example_block: str) -> str:
    block_lower = example_block.lower()
    for category, keywords in _CATEGORY_KEYWORDS.items():
        if any(keyword in block_lower for keyword in keywords):
            return category
    return "biography"


def _placeholder(title: str, description: str) -> str:
    return f"# {title}\n\n{description}\n"


def _ensure_dirs() -> None:
    for directory in (CONVERSATIONS, STORIES, PERSONAL, PROJECTS):
        directory.mkdir(parents=True, exist_ok=True)


def _move_projects() -> None:
    for source_name, dest in PROJECT_MOVES.items():
        source = KNOWLEDGE / source_name
        if source.is_file():
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(source), str(dest))


def _split_conversations() -> None:
    source = KNOWLEDGE / "conversation_examples.md"
    if not source.is_file():
        return

    raw = source.read_text(encoding="utf-8")
    blocks = [block.strip() for block in _EXAMPLE_SPLIT.split(raw) if block.strip().startswith("## Example:")]

    grouped: dict[str, list[str]] = {name.removesuffix(".md"): [] for name in CONVERSATION_FILES}

    for block in blocks:
        category = _classify_example(block)
        grouped[category].append(block)

    for filename in CONVERSATION_FILES:
        stem = filename.removesuffix(".md")
        examples = grouped.get(stem, [])
        header = _placeholder(
            stem.replace("_", " ").title(),
            "Training conversations — Lakshay's voice, reasoning, and tone preserved.",
        )
        body = "\n\n---\n\n".join(examples) if examples else "<!-- Add ## Example: blocks here -->"
        (CONVERSATIONS / filename).write_text(f"{header}\n\n{body}\n", encoding="utf-8")

    backup = KNOWLEDGE / "_archive_conversation_examples.md"
    if not backup.exists():
        shutil.move(str(source), str(backup))


def _create_story_and_personal_placeholders() -> None:
    story_descriptions = {
        "childhood": "Early life and formative moments.",
        "school": "School years and learning experiences.",
        "college": "College life at IPEC and AIML journey.",
        "hackathons": "Hackathon builds, wins, and lessons.",
        "internship": "Internship and early professional experiences.",
        "funny_moments": "Light moments and humor.",
    }
    personal_descriptions = {
        "hobbies": "What Lakshay does outside work.",
        "favorites": "Favorite books, tools, food, and media.",
        "goals": "Personal and professional goals.",
        "daily_life": "Day-to-day routines and balance.",
    }

    for filename in STORY_FILES:
        path = STORIES / filename
        if not path.is_file():
            stem = filename.removesuffix(".md")
            path.write_text(
                _placeholder(stem.replace("_", " ").title(), story_descriptions[stem]),
                encoding="utf-8",
            )

    for filename in PERSONAL_FILES:
        path = PERSONAL / filename
        if not path.is_file():
            stem = filename.removesuffix(".md")
            path.write_text(
                _placeholder(stem.replace("_", " ").title(), personal_descriptions[stem]),
                encoding="utf-8",
            )


def main() -> None:
    _ensure_dirs()
    _move_projects()
    _split_conversations()
    _create_story_and_personal_placeholders()
    print("Knowledge reorganization complete.")


if __name__ == "__main__":
    main()
