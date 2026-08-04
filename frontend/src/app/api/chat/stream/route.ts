import { proxyToBackend } from '@/lib/proxy-backend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    return await proxyToBackend(request, '/chat/stream', { stream: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach AI backend.';
    return Response.json({ detail: message }, { status: 500 });
  }
}
