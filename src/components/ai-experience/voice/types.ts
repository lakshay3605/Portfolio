/**
 * Voice layer — prepared for ElevenLabs / OpenAI Realtime integration.
 * Not wired in the cinematic milestone.
 */

export interface VoiceSpeakOptions {
  text: string;
  lineId?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface VoiceProvider {
  readonly id: string;
  speak(options: VoiceSpeakOptions): Promise<void>;
  stop(): void;
  dispose(): void;
}

export interface VoiceServiceConfig {
  provider: VoiceProvider;
  enabled: boolean;
}
