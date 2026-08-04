import { proxyToBackend } from '@/lib/proxy-backend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handle(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const backendPath = `/mission-control/${path.join('/')}`;

  try {
    return await proxyToBackend(request, backendPath);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach AI backend.';
    return Response.json({ detail: message }, { status: 500 });
  }
}

export async function GET(request: Request, context: RouteContext) {
  return handle(request, context);
}
