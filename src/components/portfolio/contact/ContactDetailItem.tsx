'use client';

import type { LucideIcon } from 'lucide-react';
import { Github, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react';
import { Typography } from '@/components/ui/Typography';
import { cn } from '@/lib/cn';
import type { ContactDetail } from './types';

const iconMap = {
  name: User,
  email: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
  location: MapPin
} satisfies Record<ContactDetail['id'], LucideIcon>;

export interface ContactDetailItemProps {
  detail: ContactDetail;
  className?: string;
}

export function ContactDetailItem({ detail, className }: ContactDetailItemProps) {
  const Icon = iconMap[detail.id];
  const isLink = Boolean(detail.href);

  return (
    <div className={cn('flex items-start gap-content-sm', className)}>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-primary/70 bg-background/40">
        <Icon className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
      </span>

      <div className="min-w-0 pt-1">
        <Typography variant="caption" className="text-text-tertiary">
          {detail.label}
        </Typography>

        {isLink ? (
          <a
            href={detail.href}
            className="mt-1 block text-base text-text-primary transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            {...(detail.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            aria-label={
              detail.external
                ? `Open ${detail.label}: ${detail.value}`
                : `${detail.label}: ${detail.value}`
            }
          >
            {detail.value}
          </a>
        ) : (
          <Typography variant="body" as="p" className="mt-1 text-text-primary">
            {detail.value}
          </Typography>
        )}
      </div>
    </div>
  );
}
