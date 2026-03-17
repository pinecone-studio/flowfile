import { createYoga } from 'graphql-yoga';
import type { AppEnv } from '../http/types';
import { createGraphQLContext } from './context';
import { graphqlSchema } from './schema';

type GraphQLServerContext = {
  env: AppEnv['Bindings'];
};

export const yoga = createYoga<GraphQLServerContext>({
  schema: graphqlSchema,
  graphqlEndpoint: '/graphql',
  landingPage: false,
  graphiql: true,
  maskedErrors: false,
  context: ({ env }) => createGraphQLContext(env),
});
