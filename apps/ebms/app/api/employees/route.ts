import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { proxyEmployeesIndex } from './employeeProxy';

export async function GET() {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const token = await getToken();
  const response = await proxyEmployeesIndex(token);

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.contentType,
    },
  });
}
