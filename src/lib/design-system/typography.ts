export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'body-lg'
  | 'caption'
  | 'overline';

const variantStyles: Record<TypographyVariant, string> = {
  display:
    'text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl md:text-6xl md:leading-[1.08]',
  h1: 'text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl md:text-5xl',
  h2: 'text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl',
  h3: 'text-xl font-medium tracking-tight text-text-primary sm:text-2xl',
  body: 'text-base leading-relaxed text-text-secondary',
  'body-lg': 'text-lg leading-relaxed text-text-secondary',
  caption: 'text-sm leading-normal text-text-tertiary',
  overline: 'text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary'
};

export function typographyClass(variant: TypographyVariant): string {
  return variantStyles[variant];
}

export { variantStyles as typographyStyles };
