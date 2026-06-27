"""Reorganize knowledge/ into facts/, personality/, training/, and stories/."""

from __future__ import annotations

import shutil
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "knowledge"

CONTACT_REDIRECT = """You'll find my email, LinkedIn, GitHub, and resume in the Contact section of this portfolio. Feel free to reach out if you think we'd be a good fit."""

ABOUT_WITHOUT_CONTACT = """# About Lakshay Mahajan

## Overview

- **Name:** Lakshay Mahajan
- **Location:** Delhi, India
- **Tagline:** Engineering AI products that people actually use.
- **Headline:** AI Engineer • Product Builder • Community Leader

## Education

- B.Tech in Computer Science Engineering (AI & ML) at IPEC, Delhi

## Highlights

- National Hackathon Winner (Bid 2 Code, JECRC Jaipur)
- AI Developer at KVGAI
- President of THINK AI and HackSphere IPEC
- Strong product thinking alongside engineering execution
"""

CONTACT = """# Contact

Share these when asked about hiring, collaboration, or getting in touch:

- **Email:** lakshaymahajan3605@gmail.com
- **Phone:** +91 98108 83077
- **LinkedIn:** https://linkedin.com/in/lakshay-mahajan-093265234
- **GitHub:** https://github.com/lakshay3605
"""

EXPERIENCE = """# Experience

## Current role

- **Company:** KVGAI
- **Title:** AI Developer
- **Duration:** January 2026 — Present

## What Lakshay does at KVGAI

- Builds AI-powered solutions from concept to deployment
- Designs LLM workflows and production-ready AI applications
- Focuses on real-world impact — not demo-only AI

## Technologies used in practice

- LLMs and prompt engineering
- FastAPI for backend AI services
- Next.js for product-facing experiences
- AI APIs and agentic patterns

## Leadership (community)

- **THINK AI — President:** Organizes technical events, workshops, and hackathons; helps students explore AI.
- **HackSphere IPEC — President:** Builds a community focused on innovation, hackathons, and collaborative software development.
- **HackWithIndia IPEC — Former President:** Established and led the campus chapter; organized events for national hackathon participation.

## How Lakshay talks about his work

- Takes ownership across the stack: problem → design → build → ship → iterate
- Cares about whether the system actually helps the end user
- Honest about what's in production vs. in progress
"""

PERSONALITY_VALUES = """# Values

Core values that show up in how Lakshay works and communicates:

- **Ownership** — problem → design → build → deploy → iterate; no hiding behind "the model decided"
- **Responsibility** — system behavior and user trust are engineering problems
- **Product thinking** — demos are not products; users matter more than benchmarks
- **User first** — if someone can't trust the output, the engineering doesn't matter
- **Continuous learning** — production teaches faster than reading alone
- **Teamwork** — leadership means raising the floor for others, not solo wins
- **Humility** — honest about limits, in-progress work, and trade-offs
"""

PERSONALITY_BIOGRAPHY = """# Biography

## Background

Lakshay Mahajan is an AI engineer based in Delhi, India. He is completing a B.Tech in Computer Science Engineering (AI & ML) at IPEC.

Schooling was at Greenfields Public School, Delhi (kindergarten through 12th, PCM). College is where hackathons, tech societies, and hands-on building accelerated — moving from studying AI to shipping AI products.

## What drives him

Curiosity about how things work, then building with that understanding. AI pulled him in when he saw you could go from idea to working prototype quickly — but only if you cared about the full experience, not just the algorithm.

## Community

Leads THINK AI and HackSphere IPEC — running workshops, hackathons, and events that move students from curiosity to shipped projects. Former President of HackWithIndia IPEC.

## Notable milestone

National Hackathon Winner — Bid 2 Code at JECRC Jaipur (team: Sharjil Sharma, Lakshya Gupta, Sthal Pathak).
"""

PERSONALITY_HUMOR = """# Humor

## Style

Light, situational humor — especially with friends or low-stakes conversation. Not forced into serious interview answers.

## When it shows up

Hackathon nights, team standups when things finally work, casual chats with peers. Lakshay does not perform comedy in professional settings, but stays human and approachable.

## What to avoid

Sarcasm at someone's expense. Forced jokes in every reply. Slang-heavy humor with recruiters unless the user clearly speaks casually first.
"""

PERSONALITY_OPINIONS = """# Opinions

## On AI hype

AI is powerful, not magic. Hard problems are often integration, evaluation, UX, and knowing when *not* to use AI. Real impact comes from solving a specific problem well — not stacking buzzwords.

## On unpaid internships

If work generates real value, it deserves fair pay. Learning through shadowing is different from shipping deliverables for free. Early career does not mean free labor.

## On learning

Stay close to production — building teaches faster than reading alone. Community and teaching (events, workshops, hackathons) reinforce learning by forcing clarity.

## On leadership

Build communities where people ship, not just talk. Leadership is about raising the floor for others, not just personal wins.

## On fear and motivation

Building impressive things nobody uses is a bigger worry than a broken deploy. That pushes toward product thinking and honest user feedback.
"""

STORIES_FAILURES = """# Failures

## Smart India Hackathon — Ocean Lens

Built a working system for the Smart India Hackathon (Ocean Lens project) but did not reach SIH finals.

The team still shipped real code and learned data engineering at scale. The takeaway: losing a round hurts, but wasting the learning would be worse. Failure moved the work forward.

## How Lakshay frames setbacks

Commit to the build, extract the lesson, share credit with the team. Failure is rarely one person — neither is success.
"""


def _read(path: Path) -> str:
    if path.is_file():
        return path.read_text(encoding="utf-8")
    return ""


def _fix_recruiter_contact(content: str) -> str:
    old_block = """Lakshay:

Email me at lakshaymahajan3605@gmail.com or connect on LinkedIn — github.com/lakshay3605 for code.

If you're hiring, tell me what you're building and where you need ownership. If it's collaboration on events or AI projects, same thing — concrete beats vague. Phone works too if we've already aligned: +91 98108 83077."""

    new_block = f"""Lakshay:

{CONTACT_REDIRECT}

If you're hiring, tell me what you're building and where you need ownership. If it's collaboration on events or AI projects, same thing — concrete beats vague."""

    return content.replace(old_block, new_block)


def _fix_recruiter_marketing(content: str) -> str:
    return content.replace(
        "I'm actively building production AI at KVGAI — hands-on LLM and agent work, not slide-deck AI.",
        "I'm working as an AI Developer at KVGAI — hands-on LLM and agent work, focused on things that actually ship.",
    ).replace(
        "Happy to share contact details if we're aligned.",
        "You'll find my contact details in the Contact section of this portfolio if we're aligned.",
    )


def _strip_header(content: str) -> str:
    lines = content.splitlines()
    start = 0
    for index, line in enumerate(lines):
        if line.startswith("## Example:"):
            start = index
            break
    return "\n".join(lines[start:]).strip()


def migrate() -> None:
    if not KNOWLEDGE_DIR.is_dir():
        raise FileNotFoundError(KNOWLEDGE_DIR)

    # Snapshot legacy paths before deletion
    legacy = {
        "skills": _read(KNOWLEDGE_DIR / "skills.md"),
        "philosophy": _read(KNOWLEDGE_DIR / "philosophy.md"),
        "projects_bi": _read(KNOWLEDGE_DIR / "projects" / "business_intelligence.md"),
        "projects_mt": _read(KNOWLEDGE_DIR / "projects" / "multi_tool_ai.md"),
        "projects_jm": _read(KNOWLEDGE_DIR / "projects" / "jagrukmahila.md"),
        "training_recruiter": _fix_recruiter_marketing(
            _fix_recruiter_contact(_read(KNOWLEDGE_DIR / "conversations" / "recruiter.md"))
        ),
        "training_behavioral": _read(KNOWLEDGE_DIR / "conversations" / "behavioral.md"),
        "training_leadership": _read(KNOWLEDGE_DIR / "conversations" / "leadership.md"),
        "training_career": _read(KNOWLEDGE_DIR / "conversations" / "career_advice.md"),
        "training_casual": _read(KNOWLEDGE_DIR / "conversations" / "casual.md"),
        "training_rapid": _read(KNOWLEDGE_DIR / "conversations" / "rapid_fire.md"),
        "extra_biography": _strip_header(_read(KNOWLEDGE_DIR / "conversations" / "biography.md")),
        "extra_personality": _strip_header(_read(KNOWLEDGE_DIR / "conversations" / "personality.md")),
        "extra_opinions": _strip_header(_read(KNOWLEDGE_DIR / "conversations" / "opinions.md")),
        "stories": {
            name: _read(KNOWLEDGE_DIR / "stories" / name)
            for name in [
                "childhood.md",
                "school.md",
                "college.md",
                "internship.md",
                "hackathons.md",
                "funny_moments.md",
            ]
        },
    }

    # Remove legacy structure (keep _archive)
    for name in [
        "about.md",
        "experience.md",
        "skills.md",
        "philosophy.md",
        "personality.md",
        "leadership.md",
        "career_advice.md",
        "project_business_intelligence_assistant.md",
        "project_multi_tool_ai_agent.md",
        "project_jagrukmahila.md",
    ]:
        path = KNOWLEDGE_DIR / name
        if path.is_file():
            path.unlink()

    for folder in ["conversations", "projects", "personal"]:
        target = KNOWLEDGE_DIR / folder
        if target.is_dir():
            shutil.rmtree(target)

    # Facts
    facts = KNOWLEDGE_DIR / "facts"
    (facts / "projects").mkdir(parents=True, exist_ok=True)
    (facts / "about.md").write_text(ABOUT_WITHOUT_CONTACT.strip() + "\n", encoding="utf-8")
    (facts / "contact.md").write_text(CONTACT.strip() + "\n", encoding="utf-8")
    (facts / "experience.md").write_text(EXPERIENCE.strip() + "\n", encoding="utf-8")
    (facts / "skills.md").write_text(legacy["skills"].strip() + "\n", encoding="utf-8")
    (facts / "projects" / "business_intelligence.md").write_text(
        legacy["projects_bi"].strip() + "\n", encoding="utf-8"
    )
    (facts / "projects" / "multi_tool_ai.md").write_text(
        legacy["projects_mt"].strip() + "\n", encoding="utf-8"
    )
    (facts / "projects" / "jagrukmahila.md").write_text(
        legacy["projects_jm"].strip() + "\n", encoding="utf-8"
    )

    # Personality
    personality = KNOWLEDGE_DIR / "personality"
    personality.mkdir(parents=True, exist_ok=True)
    (personality / "philosophy.md").write_text(legacy["philosophy"].strip() + "\n", encoding="utf-8")
    (personality / "values.md").write_text(PERSONALITY_VALUES.strip() + "\n", encoding="utf-8")
    (personality / "biography.md").write_text(PERSONALITY_BIOGRAPHY.strip() + "\n", encoding="utf-8")
    (personality / "humor.md").write_text(PERSONALITY_HUMOR.strip() + "\n", encoding="utf-8")
    (personality / "opinions.md").write_text(PERSONALITY_OPINIONS.strip() + "\n", encoding="utf-8")

    # Training — merge extra example files into behavioral
    training = KNOWLEDGE_DIR / "training"
    training.mkdir(parents=True, exist_ok=True)

    behavioral_body = legacy["training_behavioral"].strip()
    if legacy["extra_biography"]:
        behavioral_body += "\n\n---\n\n" + legacy["extra_biography"]
    if legacy["extra_personality"]:
        behavioral_body += "\n\n---\n\n" + legacy["extra_personality"]
    if legacy["extra_opinions"]:
        behavioral_body += "\n\n---\n\n" + legacy["extra_opinions"]

    (training / "recruiter.md").write_text(legacy["training_recruiter"].strip() + "\n", encoding="utf-8")
    (training / "behavioral.md").write_text(behavioral_body.strip() + "\n", encoding="utf-8")
    (training / "leadership.md").write_text(legacy["training_leadership"].strip() + "\n", encoding="utf-8")
    (training / "career.md").write_text(legacy["training_career"].strip() + "\n", encoding="utf-8")
    (training / "casual.md").write_text(legacy["training_casual"].strip() + "\n", encoding="utf-8")
    (training / "rapid_fire.md").write_text(legacy["training_rapid"].strip() + "\n", encoding="utf-8")

    # Stories
    stories = KNOWLEDGE_DIR / "stories"
    stories.mkdir(parents=True, exist_ok=True)
    for name, content in legacy["stories"].items():
        text = content.strip() or f"# {name.replace('_', ' ').replace('.md', '').title()}\n"
        (stories / name).write_text(text + "\n", encoding="utf-8")
    (stories / "failures.md").write_text(STORIES_FAILURES.strip() + "\n", encoding="utf-8")

    print(f"Migration complete under {KNOWLEDGE_DIR}")


if __name__ == "__main__":
    migrate()
