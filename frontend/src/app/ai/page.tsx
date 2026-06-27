import { AiConversation } from '@/components/ai-chat';
import { isBetaModeEnabled } from '@/lib/beta.server';
import { AiExperienceClient } from './AiExperienceClient';

export default function AiExperiencePage() {
  if (isBetaModeEnabled()) {
    return <AiConversation />;
  }

  return <AiExperienceClient />;
}
