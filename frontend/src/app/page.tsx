import { redirect } from 'next/navigation';
import { BootScreen } from '@/components/boot/BootScreen';
import { isBetaModeEnabled } from '@/lib/beta.server';

export default function Page() {
  if (isBetaModeEnabled()) {
    redirect('/ai');
  }

  return <BootScreen />;
}
