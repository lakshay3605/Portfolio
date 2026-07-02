import { Container } from '@/components/ui/Container';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <div className="relative min-h-svh overflow-hidden lg:h-svh lg:max-h-svh">
      <HeroBackground />

      <Container
        size="xl"
        className="relative z-10 flex min-h-svh flex-col justify-center pt-16 pb-10 lg:min-h-0 lg:h-full lg:pb-6"
      >
        <div className="grid grid-cols-1 items-center gap-content-xl lg:grid-cols-5 lg:gap-content-lg">
          <div className="lg:col-span-3">
            <HeroContent />
          </div>
          <div className="lg:col-span-2">
            <HeroPortrait />
          </div>
        </div>
      </Container>
    </div>
  );
}
