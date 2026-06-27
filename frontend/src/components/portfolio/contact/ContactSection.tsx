'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fadeUp, transition } from '@/lib/motion';
import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { CONTACT_DETAILS, CONTACT_INFO, CONTACT_SECTION } from './data';
import { ContactDetailItem } from './ContactDetailItem';

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={CONTACT_SECTION.title} />

        <motion.div
          initial={prefersReducedMotion ? false : 'initial'}
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          transition={transition.slow}
          className="mx-auto flex max-w-lg flex-col items-center"
        >
          <div className="w-full rounded-card border border-border-primary/80 bg-surface/40 p-content-md shadow-card sm:p-content-lg">
            <ul className="flex flex-col gap-content-md" role="list">
              {CONTACT_DETAILS.map((detail) => (
                <li key={detail.id}>
                  <ContactDetailItem detail={detail} />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-content-lg">
            <Button asChild size="lg">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                aria-label={`${CONTACT_SECTION.ctaLabel} via email`}
              >
                {CONTACT_SECTION.ctaLabel}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
