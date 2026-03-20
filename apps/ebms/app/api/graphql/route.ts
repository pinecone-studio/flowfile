import { proxyToBackend } from '../backend-proxy';

export async function POST(request: Request) {
  return proxyToBackend({
    path: '/graphql',
    method: 'POST',
    body: await request.text(),
  });
}
