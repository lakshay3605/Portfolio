'use client';

import { PageTransition } from './PageTransition';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { AiTwinChatProvider } from '@/components/ai-chat/AiTwinChatProvider';
import { AiTwinLauncher } from '@/components/ai-chat/AiTwinLauncher';
import { AiTwinModal } from '@/components/ai-chat/AiTwinModal';
import { FloatingAssistantProvider } from '@/components/ai-chat/FloatingAssistantProvider';

export interface PortfolioLayoutProps {
  children: React.ReactNode;
}

export function PortfolioLayout({ children }: PortfolioLayoutProps) {
  return (
    <FloatingAssistantProvider>
      <AiTwinChatProvider>
        <Navigation />
        <PageTransition>
          <div className="relative bg-background">{children}</div>
        </PageTransition>
        <Footer />
        <AiTwinLauncher />
        <AiTwinModal />
      </AiTwinChatProvider>
    </FloatingAssistantProvider>
  );
}
