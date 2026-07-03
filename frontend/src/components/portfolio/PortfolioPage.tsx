import { Container } from '@/components/ui/Container';
import { HeroSection } from '@/components/portfolio/hero/HeroSection';
import { ProjectsSection } from '@/components/portfolio/projects/ProjectsSection';
import { ExperienceSection } from '@/components/portfolio/experience/ExperienceSection';
import { LeadershipSection } from '@/components/portfolio/leadership/LeadershipSection';
import { SkillsSection } from '@/components/portfolio/skills/SkillsSection';
import { ResumeSection } from '@/components/portfolio/resume/ResumeSection';
import { ContactSection } from '@/components/portfolio/contact/ContactSection';
import { PortfolioLayout } from './PortfolioLayout';
import { SectionPlaceholder } from './SectionPlaceholder';

const SECTIONS = [
  { id: 'hero', name: 'Hero', variant: 'default' as const, spacing: 'lg' as const },
  { id: 'projects', name: 'Projects', variant: 'default' as const, spacing: 'md' as const },
  { id: 'experience', name: 'Experience', variant: 'alternate' as const, spacing: 'md' as const },
  { id: 'leadership', name: 'Leadership', variant: 'default' as const, spacing: 'md' as const },
  { id: 'skills', name: 'Skills', variant: 'alternate' as const, spacing: 'md' as const },
  { id: 'resume', name: 'Resume', variant: 'default' as const, spacing: 'md' as const },
  { id: 'contact', name: 'Contact', variant: 'alternate' as const, spacing: 'md' as const }
] as const;

function renderSectionContent(sectionId: (typeof SECTIONS)[number]['id']) {
  switch (sectionId) {
    case 'hero':
      return <HeroSection />;
    case 'projects':
      return <ProjectsSection />;
    case 'experience':
      return <ExperienceSection />;
    case 'leadership':
      return <LeadershipSection />;
    case 'skills':
      return <SkillsSection />;
    case 'resume':
      return <ResumeSection />;
    case 'contact':
      return <ContactSection />;
    default:
      return (
        <Container size="xl">
          <SectionPlaceholder
            name={SECTIONS.find((section) => section.id === sectionId)?.name ?? sectionId}
          />
        </Container>
      );
  }
}

export function PortfolioPage() {
  return (
    <PortfolioLayout>
      {SECTIONS.map((section, index) => {
        if (section.id === 'resume') {
          return (
            <div key={section.id} id={section.id}>
              {index > 0 && <div className="section-divider" />}
              {renderSectionContent(section.id)}
            </div>
          );
        }
        return (
          <div key={section.id}>
            {index > 0 && <div className="section-divider" />}
            <section
              id={section.id}
              className={section.id === 'hero' ? 'hero-wrap' : 'section'}
            >
              {renderSectionContent(section.id)}
            </section>
          </div>
        );
      })}
    </PortfolioLayout>
  );
}

export { SECTIONS };
