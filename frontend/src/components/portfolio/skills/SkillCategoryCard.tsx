import { cn } from '@/lib/cn';
import type { SkillCategory } from './types';

export interface SkillCategoryCardProps {
  category: SkillCategory;
  className?: string;
}

export function SkillCategoryCard({ category, className }: SkillCategoryCardProps) {
  return (
    <div className={cn('skill-card', className)}>
      <div className="skill-title">{category.title}</div>
      <div className="chip-row">
        {category.skills.map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
