import type { Context, Next } from 'hono';
import { verifyToken } from '@clerk/backend';
import type { AppEnv } from '../types';

type AuthUser = {
  id: string;
  sessionId?: string;
};

export async function requireAuth(
  c: Context<AppEnv>,
  next: Next,
): Promise<Response | void> {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;

    if (!token) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const authorizedParties = c.env.CLERK_AUTHORIZED_PARTIES
      ? c.env.CLERK_AUTHORIZED_PARTIES.split(',').map((value) => value.trim())
      : undefined;

    const payload = await verifyToken(token, {
      jwtKey: c.env.CLERK_JWT_KEY,
      secretKey: c.env.CLERK_SECRET_KEY,
      authorizedParties,
    });

    const user: AuthUser = {
      id: payload.sub,
      sessionId: typeof payload.sid === 'string' ? payload.sid : undefined,
    };

    c.set('authUser', user);

    await next();
    return;
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return c.json({ message: 'Unauthorized' }, 401);
  }
}
