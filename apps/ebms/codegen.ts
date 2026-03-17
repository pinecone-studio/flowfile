import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../worker/src/graphql/schema.ts',
  documents: ['lib/graphql/**/*.graphql'],
  ignoreNoDocuments: false,
  generates: {
    'lib/graphql/generated/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
