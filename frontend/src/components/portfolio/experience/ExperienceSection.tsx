import { FEATURED_EXPERIENCE } from './data';
import { ExperienceCard } from './ExperienceCard';

export function ExperienceSection() {
  return (
    <>
      <div className="section-header reveal">
        <div className="section-eyebrow">Journey</div>
        <h2 className="section-title">
          Work <span className="grad">Experience</span>
        </h2>
      </div>

      <div className="timeline reveal">
        <div className="timeline-item">
          <ExperienceCard experience={FEATURED_EXPERIENCE} />
        </div>
      </div>
    </>
  );
}
