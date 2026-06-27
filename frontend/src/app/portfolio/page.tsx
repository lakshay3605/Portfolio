import type { Metadata } from 'next';
import { PortfolioPage } from '@/components/portfolio/PortfolioPage';

export const metadata: Metadata = {
  title: 'Portfolio | Lakshay Mahajan',
  description: "Explore Lakshay Mahajan's work, experience, and background."
};

export default function Page() {
  return <PortfolioPage />;
}
