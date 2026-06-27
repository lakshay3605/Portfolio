import { redirect } from 'next/navigation';
import { BootScreen } from '@/components/boot/BootScreen';
import { BETA_MODE } from '@/lib/beta';

export default function Page() {
  if (BETA_MODE) {
    redirect('/ai');
  }

  return <BootScreen />;
}
