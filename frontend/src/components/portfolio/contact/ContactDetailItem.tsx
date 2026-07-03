import { cn } from '@/lib/cn';
import type { ContactDetail } from './types';

const emojiMap = {
  name: '👤',
  email: '📧',
  phone: '📞',
  linkedin: '🔗',
  github: '💻',
  location: '📍'
} satisfies Record<ContactDetail['id'], string>;

export interface ContactDetailItemProps {
  detail: ContactDetail;
  className?: string;
}

export function ContactDetailItem({ detail, className }: ContactDetailItemProps) {
  const emoji = emojiMap[detail.id] || '✉️';
  const isLink = Boolean(detail.href);

  return (
    <div className={cn('contact-row', className)}>
      <div className="contact-ico">{emoji}</div>
      <div>
        <div className="contact-label">{detail.label}</div>
        {isLink ? (
          <a
            href={detail.href}
            className="contact-value"
            {...(detail.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {detail.value}
          </a>
        ) : (
          <div className="contact-value">{detail.value}</div>
        )}
      </div>
    </div>
  );
}
