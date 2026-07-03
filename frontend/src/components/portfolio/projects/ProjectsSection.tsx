import { FEATURED_PROJECTS } from './data';
import { ProductShowcase } from './ProductShowcase';

export function ProjectsSection() {
  return (
    <>
      <div className="section-header reveal">
        <div className="section-eyebrow">Projects</div>
        <h2 className="section-title">
          Featured <span className="grad">Work</span>
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {FEATURED_PROJECTS.map((project) => (
          <ProductShowcase key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
