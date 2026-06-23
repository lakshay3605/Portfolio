# Design System

## Principles
- Reusable components with predictable props
- Consistent spacing, typography, and color tokens
- Accessible interactions and semantic markup
- Motion-aware components for a polished experience

## Component categories
- Atoms: buttons, inputs, labels, badges, icons
- Molecules: cards, form rows, navigation items, dialogs
- Organisms: chat shell, project highlight, timeline panels

## UI toolchain
- Tailwind CSS utility classes for layout and styling
- shadcn/ui-inspired component primitives for consistent patterns
- Framer Motion for entrance, hover, and state transitions
- GSAP for complex timeline-based and scroll-driven animation

## Accessibility
- Keyboard focus states and logical tab order
- ARIA roles and labels where needed
- Contrast-aware text and controls
- Screen reader-friendly structure for conversational content

## Reusability
- Keep components small and focused
- Compose complex views from simple primitives
- Avoid duplication by centralizing shared logic in `src/lib`
