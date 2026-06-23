import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { LEADERSHIP_ITEMS, LEADERSHIP_SECTION } from './data';
import { LeadershipCard } from './LeadershipCard';

export function LeadershipSection() {
  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={LEADERSHIP_SECTION.title} />

        <div className="flex flex-col gap-content-xl lg:gap-section-sm">
          {LEADERSHIP_ITEMS.map((leadership) => (
            <LeadershipCard key={leadership.id} leadership={leadership} />
          ))}
        </div>
      </div>
    </Container>
  );
}
