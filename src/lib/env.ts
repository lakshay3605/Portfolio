/**
 * Environment variable validators and getters
 */

function getEnvVar(key: string, optional = false): string {
  const value = process.env[key];

  if (!value && !optional) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value || '';
}

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  openaiApiKey: () => getEnvVar('OPENAI_API_KEY', true),
  supabaseUrl: () => getEnvVar('NEXT_PUBLIC_SUPABASE_URL', true),
  supabaseAnonKey: () => getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
  elevenLabsApiKey: () => getEnvVar('ELEVENLABS_API_KEY', true)
};
