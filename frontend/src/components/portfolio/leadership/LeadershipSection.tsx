import { LEADERSHIP_ITEMS } from './data';
import { LeadershipCard } from './LeadershipCard';

export function LeadershipSection() {
  return (
    <>
      <div className="section-header reveal">
        <div className="section-eyebrow">Community</div>
        <h2 className="section-title">
          Leadership <span className="grad">roles</span>
        </h2>
      </div>

      <div className="lead-grid reveal-scale">
        {LEADERSHIP_ITEMS.map((leadership) => (
          <LeadershipCard key={leadership.id} leadership={leadership} />
        ))}
      </div>
    </>
  );
}
