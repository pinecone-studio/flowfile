import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    authUser: {
      id: string;
      sessionId?: string;
    };
  }
}
