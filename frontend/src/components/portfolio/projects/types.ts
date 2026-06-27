export type ProjectLayout = 'text-left' | 'text-right';

export type ProjectStatusVariant = 'under-development' | 'planning' | 'live';

export interface ProjectStatus {
  emoji: string;
  label: string;
  description: string;
  variant: ProjectStatusVariant;
}

export interface ProjectMedia {
  type: 'placeholder' | 'image' | 'video';
  src?: string;
  alt?: string;
  poster?: string;
}

export interface ProjectData {
  id: string;
  status: ProjectStatus;
  title: string;
  description: string;
  media: ProjectMedia;
  technologies: string[];
  layout: ProjectLayout;
  liveUrl?: string;
  githubUrl?: string;
}
