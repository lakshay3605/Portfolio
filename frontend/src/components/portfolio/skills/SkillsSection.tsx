import { SKILL_CATEGORIES } from './data';
import { SkillCategoryCard } from './SkillCategoryCard';

export function SkillsSection() {
  return (
    <>
      <div className="section-header reveal">
        <div className="section-eyebrow">Skills</div>
        <h2 className="section-title">
          My <span className="grad">Toolbox</span>
        </h2>
      </div>

      <div className="skill-grid reveal-scale">
        {SKILL_CATEGORIES.map((category) => (
          <SkillCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </>
  );
}
