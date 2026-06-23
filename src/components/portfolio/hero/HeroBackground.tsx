export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 hero-bg-radial" />
      <div className="absolute inset-0 hero-bg-radial-secondary" />
      <div className="absolute inset-0 hero-bg-grid opacity-60" />
      <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute -left-16 bottom-1/4 h-64 w-64 rounded-full bg-secondary/[0.04] blur-3xl" />
    </div>
  );
}
