import { cn } from '@/lib/cn';
import type { ExperienceData } from './types';

export interface ExperienceCardProps {
  experience: ExperienceData;
  className?: string;
}

export function ExperienceCard({ experience, className }: ExperienceCardProps) {
  return (
    <div className={cn('exp-card', className)}>
      <div className="exp-top">
        <span className="exp-company">{experience.company}</span>
        <span className="exp-date">{experience.duration}</span>
      </div>
      <div className="exp-role">{experience.role}</div>
      <p className="exp-desc">{experience.description}</p>
      <div className="tag-row">
        {experience.technologies.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
