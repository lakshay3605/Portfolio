import { getBackendBaseUrl } from './server-api-url';

interface ProxyOptions {
  stream?: boolean;
}

export async function proxyToBackend(
  request: Request,
  backendPath: string,
  options: ProxyOptions = {}
): Promise<Response> {
  const incomingUrl = new URL(request.url);
  const targetUrl = `${getBackendBaseUrl()}${backendPath}${incomingUrl.search}`;

  const headers: Record<string, string> = {};
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const requestId = request.headers.get('x-request-id');
  if (requestId) {
    headers['X-Request-ID'] = requestId;
  }

  const init: RequestInit = {
    method: request.method,
    headers
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text();
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  if (options.stream) {
    responseHeaders.set('Content-Type', 'text/event-stream');
    responseHeaders.set('Cache-Control', 'no-cache');
    responseHeaders.set('Connection', 'keep-alive');
  } else {
    const upstreamContentType = upstream.headers.get('content-type');
    if (upstreamContentType) {
      responseHeaders.set('Content-Type', upstreamContentType);
    }
  }

  const upstreamRequestId = upstream.headers.get('x-request-id');
  if (upstreamRequestId) {
    responseHeaders.set('X-Request-ID', upstreamRequestId);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}
