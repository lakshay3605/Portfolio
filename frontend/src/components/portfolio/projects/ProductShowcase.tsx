'use client';

import { Github as GithubIcon } from 'lucide-react';
import { useFloatingAssistant } from '@/components/ai-chat/FloatingAssistantProvider';
import { cn } from '@/lib/cn';
import type { ProjectData } from './types';

export interface ProductShowcaseProps {
  project: ProjectData;
  className?: string;
}

export function ProductShowcase({ project, className }: ProductShowcaseProps) {
  const { openWithPrompt } = useFloatingAssistant();

  const handleExplainProject = () => {
    openWithPrompt(project.aiExplainPrompt);
  };

  const statusClass = 
    project.status.variant === 'live' 
      ? 'live' 
      : project.status.variant === 'under-development'
        ? 'dev'
        : 'plan';

  const statusLabel = project.status.label;

  return (
    <div
      className={cn(
        'project-card reveal',
        project.layout === 'text-right' && 'flip',
        className
      )}
    >
      <div>
        <div className={cn('proj-status', statusClass)}>
          <span className="dot" />
          {statusLabel}
        </div>

        <h2 className="proj-title">
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
          ) : (
            <span>{project.title}</span>
          )}
          {project.liveUrl && <span className="ext">↗</span>}
        </h2>

        <p className="proj-desc">{project.description}</p>

        <div className="tag-row">
          {project.technologies.map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>

        <div className="proj-links">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              className="gh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} on GitHub`}
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          ) : (
            <span className="gh opacity-40 cursor-not-allowed">
              <GithubIcon className="h-4 w-4" />
              GitHub
            </span>
          )}

          <button
            type="button"
            className="btn-ghost"
            onClick={handleExplainProject}
            aria-label={`Explain ${project.title} using AI`}
          >
            <span className="spark">✨</span>
            Explain this Project
          </button>
        </div>
      </div>

      <div className="proj-preview">
        {project.media.type === 'image' && project.media.src ? (
          <img
            src={project.media.src}
            alt={project.media.alt ?? `${project.title} preview`}
          />
        ) : (
          <div className="label">
            Product Preview
            <span className="pname">{project.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
