import { proxyToBackend } from '../backend-proxy';

export async function GET() {
  return proxyToBackend({
    path: '/employees',
    method: 'GET',
  });
}
