import type { LeadershipData } from './types';

export const LEADERSHIP_SECTION = {
  title: 'Leadership'
} as const;

export const LEADERSHIP_ITEMS: LeadershipData[] = [
  {
    id: 'think-ai',
    organization: 'THINK AI',
    role: 'President',
    description:
      "Leading one of the college's AI communities by organizing technical events, workshops, hackathons and helping students explore Artificial Intelligence."
  },
  {
    id: 'hacksphere-ipec',
    organization: 'HackSphere IPEC',
    role: 'President',
    description:
      'Building a community focused on innovation, hackathons and collaborative software development while encouraging students to build impactful products.'
  },
  {
    id: 'hackwithindia-ipec',
    organization: 'HackWithIndia IPEC',
    role: 'Former President',
    description:
      'Established and led the campus chapter while organizing events and creating opportunities for students to participate in national hackathons.'
  }
];
