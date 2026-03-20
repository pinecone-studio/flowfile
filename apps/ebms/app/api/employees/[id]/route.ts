import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { proxyEmployeeById } from '../employeeProxy';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { isAuthenticated, getToken } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const token = await getToken();
  const response = await proxyEmployeeById(id, token);

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.contentType,
    },
  });
}
