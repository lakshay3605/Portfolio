'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { fadeUp, transition } from '@/lib/motion';
import { Container } from '@/components/ui/Container';
import { SectionIntro, SECTION_LAYOUT } from '@/components/portfolio/SectionIntro';
import { RESUME_FILE, RESUME_SECTION } from './data';

export function ResumeSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Container size="xl">
      <div className={SECTION_LAYOUT}>
        <SectionIntro title={RESUME_SECTION.title} />

        <motion.div
          initial={prefersReducedMotion ? false : 'initial'}
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
          transition={transition.slow}
          className="mx-auto flex max-w-xl flex-col items-center text-center"
        >
          <Typography variant="body-lg" className="text-text-tertiary">
            {RESUME_SECTION.description}
          </Typography>

          <div className="mt-content-lg flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Button asChild size="lg">
              <a
                href={encodeURI(RESUME_FILE.downloadUrl)}
                download={RESUME_FILE.fileName}
                aria-label="Download resume as PDF"
              >
                Download Resume
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary/25 text-text-primary hover:border-primary/40 hover:bg-primary/[0.06]"
            >
              <a
                href={encodeURI(RESUME_FILE.downloadUrl)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Preview resume in a new tab"
              >
                Preview Resume
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
