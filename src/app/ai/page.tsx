import { BackgroundEffects } from '@/components/boot/BackgroundEffects';
import { GlassPanel } from '@/components/boot/GlassPanel';

export default function AiExperiencePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundEffects />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <GlassPanel className="max-w-lg text-center">
          <p className="text-sm tracking-[0.18em] text-text-tertiary uppercase">Coming soon</p>
          <h1 className="mt-4 text-3xl font-semibold text-text-primary">AI Experience</h1>
          <p className="mt-4 text-text-secondary">
            The conversational AI twin experience is being built.
          </p>
        </GlassPanel>
      </main>
    </div>
  );
}
