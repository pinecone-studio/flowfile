import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8787'
).replace(/\/+$/, '');

export async function GET() {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = await getToken();

  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
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
