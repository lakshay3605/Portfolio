import type { MouseEvent } from 'react';

const NAV_OFFSET_PX = 88;

export function scrollToPortfolioSection(sectionId: string): void {
  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export function stripAiOpenQueryParam(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('ai')) {
    return;
  }

  url.searchParams.delete('ai');
  const nextPath = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', nextPath);
}

export function handlePortfolioNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
  onNavigate?: () => void
): void {
  if (!href.startsWith('#')) {
    return;
  }

  event.preventDefault();
  stripAiOpenQueryParam();
  scrollToPortfolioSection(href.slice(1));
  onNavigate?.();
}
