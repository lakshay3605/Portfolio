import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Experience | Lakshay Mahajan',
  description: "Meet Lakshay's AI Twin — an immersive introduction before the conversation begins."
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
