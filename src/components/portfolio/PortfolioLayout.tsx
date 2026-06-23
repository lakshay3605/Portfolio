import { PageTransition } from './PageTransition';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export interface PortfolioLayoutProps {
  children: React.ReactNode;
}

export function PortfolioLayout({ children }: PortfolioLayoutProps) {
  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="relative bg-background">{children}</div>
      </PageTransition>
      <Footer />
    </>
  );
}
