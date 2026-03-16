import type { AppEnv } from '../http/types';

export type GraphQLContext = {
  env: AppEnv['Bindings'];
  requestId: string;
  user: null | {
    id: string;
    roles: string[];
  };
};

export const createGraphQLContext = (
  env: AppEnv['Bindings'],
): GraphQLContext => {
  return {
    env,
    requestId: crypto.randomUUID(),
    user: null,
  };
};
