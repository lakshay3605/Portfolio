import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { EXPERIENCE_SECTION, FEATURED_EXPERIENCE } from './data';
import { ExperienceCard } from './ExperienceCard';

export function ExperienceSection() {
  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={EXPERIENCE_SECTION.title} />
        <ExperienceCard experience={FEATURED_EXPERIENCE} />
      </div>
    </Container>
  );
}
