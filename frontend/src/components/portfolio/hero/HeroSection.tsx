import { Container } from '@/components/ui/Container';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { ProfileSummaryCard } from './ProfileSummaryCard';

export function HeroSection() {
  return (
    <div className="relative h-svh max-h-svh overflow-hidden">
      <HeroBackground />

      <Container
        size="xl"
        className="relative z-10 flex h-full flex-col justify-center pt-16 pb-6"
      >        <div className="grid grid-cols-1 items-center gap-content-lg lg:grid-cols-5 lg:gap-content-lg">
          <div className="lg:col-span-3">
            <HeroContent />
          </div>
          <div className="lg:col-span-2">
            <ProfileSummaryCard />
          </div>
        </div>
      </Container>
    </div>
  );
}