import { Container } from '@/components/ui/Container';
import { Typography } from '@/components/ui/Typography';

export function Footer() {
  return (
    <footer className="border-t border-border-primary/60 bg-background-secondary py-section-sm">
      <Container size="xl">
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography variant="caption" className="text-text-tertiary">
            Built with ❤️ by Lakshay Mahajan
          </Typography>
          <Typography variant="caption" className="text-text-disabled">
            Next.js • TypeScript • Tailwind CSS
          </Typography>
        </div>
      </Container>
    </footer>
  );
}
