import { Container } from '@/components/ui/Container';
import { HeroBackground } from './HeroBackground';
import { HeroContent } from './HeroContent';
import { HeroPortrait } from './HeroPortrait';

export function HeroSection() {
  return (
    <div className="hero-wrap-custom min-h-svh flex flex-col justify-center pt-10">
      <HeroBackground />

      <div className="hero-custom">
        <HeroContent />
        <HeroPortrait />
      </div>
    </div>
  );
}
