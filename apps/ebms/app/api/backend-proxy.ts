import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8787'
).replace(/\/+$/, '');

type ProxyOptions = {
  path: string;
  method?: 'GET' | 'POST';
  body?: BodyInit | null;
};

export async function proxyToBackend({
  path,
  method = 'GET',
  body,
}: ProxyOptions) {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = await getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const rawText = await response.text();

  return new NextResponse(rawText, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') || 'application/json',
    },
  });
}
