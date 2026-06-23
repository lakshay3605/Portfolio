import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { FEATURED_PROJECTS, PROJECTS_SECTION } from './data';
import { ProductShowcase } from './ProductShowcase';

export function ProjectsSection() {
  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={PROJECTS_SECTION.title} />

        <div className="flex flex-col gap-content-xl lg:gap-section-sm">
          {FEATURED_PROJECTS.map((project) => (
            <ProductShowcase key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Container>
  );
}
