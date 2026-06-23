import { cn } from '@/lib/cn';
import { typographyClass, type TypographyVariant } from '@/lib/design-system';

export type { TypographyVariant };

type TypographyElement = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

export type TypographyProps = React.HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  as?: TypographyElement;
  children: React.ReactNode;
};

const defaultElements: Record<TypographyVariant, TypographyElement> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-lg': 'p',
  caption: 'p',
  overline: 'p'
};

export function Typography({
  variant = 'body',
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component className={cn(typographyClass(variant), className)} {...props}>
      {children}
    </Component>
  );
}
