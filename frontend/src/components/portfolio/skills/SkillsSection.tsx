import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { SKILL_CATEGORIES, SKILLS_SECTION } from './data';
import { SkillCategoryCard } from './SkillCategoryCard';

export function SkillsSection() {
  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={SKILLS_SECTION.title} />

        <div className="grid grid-cols-1 gap-content-xl md:grid-cols-2 lg:gap-section-sm">
          {SKILL_CATEGORIES.map((category) => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </Container>
  );
}
