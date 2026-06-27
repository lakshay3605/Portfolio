import type { VoiceProvider, VoiceServiceConfig, VoiceSpeakOptions } from './types';

/** Stub voice service — subtitles only until ElevenLabs is connected. */
export class VoiceService {
  private config: VoiceServiceConfig;

  constructor(config: VoiceServiceConfig) {
    this.config = config;
  }

  get isEnabled() {
    return this.config.enabled;
  }

  async speak(options: VoiceSpeakOptions): Promise<void> {
    if (!this.config.enabled) {
      options.onStart?.();
      options.onEnd?.();
      return;
    }

    await this.config.provider.speak(options);
  }

  stop() {
    this.config.provider.stop();
  }

  dispose() {
    this.config.provider.dispose();
  }
}

export function createSubtitleOnlyVoiceService(): VoiceService {
  const stubProvider: VoiceProvider = {
    id: 'subtitle-only',
    speak: async ({ onStart, onEnd }) => {
      onStart?.();
      onEnd?.();
    },
    stop: () => undefined,
    dispose: () => undefined
  };

  return new VoiceService({ provider: stubProvider, enabled: false });
}
