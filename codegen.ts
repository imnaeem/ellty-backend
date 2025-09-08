import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        'typescript-mongodb',
        'typescript-operations',
      ],
      config: {
        objectIdType: 'Types.ObjectId#mongoose', // Ensure the correct ObjectId type is used
      },
    },
  },
  hooks: {
    afterAllFileWrite: [
      // Fix Mongoose ObjectId import
      "shx sed -i \"s/import { Types.ObjectId } from 'mongoose'/import { Types } from 'mongoose'/\" src/generated/graphql.ts",
      // Change exported type to interface
      'shx sed -i "s/export type \\(\\w+\\)DbObject = {/export interface \\1DbObject {/g" src/generated/graphql.ts',
    ],
  },
};

export default config;
