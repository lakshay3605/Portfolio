'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { fadeUp, transition } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectTitle, ProjectTitleLink } from './ProjectTitleLink';
import type { ProjectData } from './types';

export interface ProductShowcaseProps {
  project: ProjectData;
  className?: string;
}

export function ProductShowcase({ project, className }: ProductShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const isVisualLeft = project.layout === 'text-right';
  const titleId = `project-${project.id}-title`;

  return (
    <motion.article
      initial={prefersReducedMotion ? false : 'initial'}
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      transition={transition.slow}
      className={cn(
        'group/showcase rounded-card border border-border-primary/80 bg-surface/40 p-content-md shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-secondary hover:shadow-card-hover sm:p-content-lg',
        className
      )}
      aria-labelledby={titleId}
    >
      <div className="grid grid-cols-1 items-center gap-content-lg lg:grid-cols-2 lg:gap-content-xl">
        <div className={cn('flex flex-col', isVisualLeft ? 'lg:order-2' : 'lg:order-1')}>
          <ProjectStatusBadge status={project.status} />

          {project.liveUrl ? (
            <ProjectTitleLink title={project.title} href={project.liveUrl} id={titleId} />
          ) : (
            <ProjectTitle title={project.title} id={titleId} />
          )}

          <Typography variant="body-lg" className="mt-content-sm max-w-xl">
            {project.description}
          </Typography>

          <ul
            className="mt-content-md flex flex-wrap gap-2"
            role="list"
            aria-label={`${project.title} technologies`}
          >
            {project.technologies.map((tech) => (
              <li key={tech}>
                <span className="inline-flex rounded-full border border-border-primary/70 bg-background/40 px-3 py-1.5 text-xs text-text-secondary">
                  {tech}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-content-lg">
            {project.githubUrl ? (
              <Button asChild size="lg">
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  GitHub
                </Link>
              </Button>
            ) : (
              <Button type="button" size="lg" aria-label={`GitHub repository for ${project.title} — coming soon`}>
                GitHub
              </Button>
            )}
          </div>
        </div>

        <div className={cn(isVisualLeft ? 'lg:order-1' : 'lg:order-2')}>
          <ProductVisual media={project.media} title={project.title} />
        </div>
      </div>
    </motion.article>
  );
}

function ProductVisual({
  media,
  title
}: {
  media: ProjectData['media'];
  title: string;
}) {
  if (media.type === 'image' && media.src) {
    return (
      <div className="group/visual overflow-hidden rounded-card border border-border-primary/80 bg-surface/30 shadow-card transition-transform duration-500 group-hover/showcase:scale-[1.01]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.src}
          alt={media.alt ?? `${title} preview`}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="group/visual relative aspect-[16/10] overflow-hidden rounded-card border border-border-primary/80 bg-surface/30 shadow-card transition-transform duration-500 group-hover/showcase:scale-[1.01] lg:min-h-[20rem]"
      role="img"
      aria-label={media.alt ?? `${title} product preview placeholder`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-text-tertiary">
          Product Preview
        </span>
        <span className="max-w-xs text-sm text-text-disabled">{title}</span>
      </div>
    </div>
  );
}
