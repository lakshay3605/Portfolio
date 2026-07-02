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
          <div className="relative bg-background min-h-screen overflow-hidden">
            {/* Global grid background */}
            <div className="bg-grid-global absolute inset-0" />
            
            {/* Ambient glows scattered down the page at regular intervals */}
            <div className="pointer-events-none absolute top-[5%] right-[-10%] w-[60%] h-[1200px] rounded-full bg-[radial-gradient(circle,rgba(139,107,255,0.08),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute top-[25%] left-[-15%] w-[50%] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.04),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute top-[48%] right-[-10%] w-[55%] h-[1100px] rounded-full bg-[radial-gradient(circle,rgba(139,107,255,0.06),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute top-[70%] left-[-10%] w-[50%] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.03),transparent_70%)] blur-3xl" />
            <div className="pointer-events-none absolute top-[85%] right-[-5%] w-[45%] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(139,107,255,0.05),transparent_70%)] blur-3xl" />

            <div className="relative z-10">{children}</div>
          </div>
        </PageTransition>
        <Footer />
        <AiTwinLauncher />
        <AiTwinModal />
      </AiTwinChatProvider>
    </FloatingAssistantProvider>
  );
}
