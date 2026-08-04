'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { handlePortfolioNavClick } from '@/lib/portfolio-navigation';

const NAV_ITEMS = [
  { label: 'About', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' }
] as const;

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <nav className={cn('nav', scrolled && 'scrolled')} aria-label="Primary navigation">
        <a
          href="#hero"
          className="logo focus-visible:outline-none"
          onClick={(event) => handlePortfolioNavClick(event, '#hero', () => setMobileOpen(false))}
        >
          <span className="bracket">&lt;</span>Lakshay<span className="dot">.ai</span><span className="bracket">/&gt;</span>
        </a>

        <ul className="nav-links hidden lg:flex" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="focus-visible:outline-none"
                onClick={(event) => handlePortfolioNavClick(event, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-button border border-border-primary text-text-primary transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-navigation"
        className={cn(
          'border-t border-white/10 bg-background/95 backdrop-blur-xl transition-all duration-300 lg:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible max-h-0 opacity-0 overflow-hidden'
        )}
      >
        <div className="px-6 py-4">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-button px-3 py-3 text-base text-text-secondary transition-colors hover:bg-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  onClick={(event) =>
                    handlePortfolioNavClick(event, item.href, () => setMobileOpen(false))
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
