'use client';

import { ArrowUpRight } from 'lucide-react';
import { Typography } from '@/components/ui/Typography';
import { cn } from '@/lib/cn';

export interface ProjectTitleLinkProps {
  title: string;
  href: string;
  id: string;
  className?: string;
}

export function ProjectTitleLink({ title, href, id, className }: ProjectTitleLinkProps) {
  return (
    <div className={cn('group/title relative mt-content-md w-fit max-w-full', className)}>
      <a
        id={id}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open live project: ${title}`}
        className="inline-flex cursor-pointer items-center gap-2 transition-colors duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="relative text-2xl font-semibold tracking-tight text-text-primary transition-colors duration-300 group-hover/title:text-primary sm:text-3xl">
          {title}
          <span
            className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 ease-out group-hover/title:w-full group-focus-within/title:w-full"
            aria-hidden="true"
          />
        </span>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-text-tertiary transition-all duration-300 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-primary"
          aria-hidden="true"
        />
      </a>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-20 mt-2 translate-y-1 rounded-lg border border-white/10 bg-background/80 px-3 py-1.5 text-xs font-medium text-text-secondary opacity-0 shadow-card backdrop-blur-md transition-all duration-300 group-hover/title:translate-y-0 group-hover/title:opacity-100 group-focus-within/title:translate-y-0 group-focus-within/title:opacity-100"
      >
        Open live project
      </span>
    </div>
  );
}

export interface ProjectTitleProps {
  title: string;
  id: string;
  className?: string;
}

export function ProjectTitle({ title, id, className }: ProjectTitleProps) {
  return (
    <Typography variant="h2" as="h3" id={id} className={cn('mt-content-md', className)}>
      {title}
    </Typography>
  );
}
