# Design System Documentation

## Overview

LakshayOS uses a cohesive dark futuristic design system with glassmorphism elements. All components are built with accessibility, reusability, and performance in mind.

## Theme

- **Background**: Deep space blue (#0a0e27)
- **Surface**: Elevated surface (#151a3a)
- **Primary**: Electric cyan (#00d9ff)
- **Secondary**: Purple (#8b5cf6)
- **Accent**: Neon pink (#ff006e)

## Typography

- **Geist** for body and UI text
- **IBM Plex Mono** for code and terminal content

## Core Components

### Button
Reusable button component with multiple variants.

```tsx
import { Button } from '@/components/ui';

export default function Example() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'accent' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean

### Card
Styled container for content.

```tsx
import { Card } from '@/components/ui';

export default function Example() {
  return (
    <Card hoverable>
      Content goes here
    </Card>
  );
}
```

**Props:**
- `hoverable`: boolean

### GlassPanel
Glassmorphism panel with blur effect.

```tsx
import { GlassPanel } from '@/components/ui';

export default function Example() {
  return (
    <GlassPanel variant="default">
      Frosted glass content
    </GlassPanel>
  );
}
```

**Props:**
- `variant`: 'default' | 'bordered'

### Section
Full-width section container.

```tsx
import { Section } from '@/components/ui';

export default function Example() {
  return (
    <Section variant="default">
      Section content
    </Section>
  );
}
```

**Props:**
- `variant`: 'default' | 'alternate'

### Container
Responsive max-width container.

```tsx
import { Container } from '@/components/ui';

export default function Example() {
  return (
    <Container size="lg">
      Content with max-width
    </Container>
  );
}
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'

## Utilities

### Gradients

```tsx
import { gradients, getGradientStyle } from '@/lib/gradients';

<div style={getGradientStyle('primary')}>
  Gradient content
</div>
```

### Class Names

```tsx
import { cn, clsx } from '@/lib/cn';

const buttonClass = cn('px-4', isActive && 'bg-primary', 'rounded');
```

### Environment Variables

```tsx
import { env } from '@/lib/env';

const apiKey = env.openaiApiKey();
```

### Theme Constants

```tsx
import { theme } from '@/lib/theme';

const bgColor = theme.colors.background;
```

## CSS Variables

All theme colors are available as CSS variables:

- `--background`
- `--primary`, `--primary-dark`, `--primary-light`
- `--secondary`, `--secondary-dark`, `--secondary-light`
- `--accent`, `--accent-dark`, `--accent-light`
- `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`
- `--success`, `--warning`, `--error`

## Animations

- `animate-fadeIn`: Fade in animation
- `animate-slideUp`: Slide up with fade
- `animate-glow`: Glowing pulse effect

## Accessibility

All components include:
- Keyboard navigation support
- Focus states
- ARIA labels where needed
- Semantic HTML
- High contrast ratios

## Best Practices

1. Use the exported components from `@/components/ui`
2. Keep components small and focused
3. Compose complex UIs from simple primitives
4. Use CSS variables for theme consistency
5. Prefer Tailwind utility classes over custom CSS
6. Always include `alt` text for images
7. Test with keyboard navigation
