import { ApolloDriverConfig } from '@nestjs/apollo';
import { registerAs } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

export const gqlConfig = registerAs(
  'gql',
  (): ApolloDriverConfig => {
    // In production (Vercel), graphql files are copied to dist/modules/ and dist/ (root)
    // In development, they're in src/modules/
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    if (isProduction) {
      // On Vercel, process.cwd() is /var/task
      // GraphQL files are in dist/modules/ and dist/ (root)
      const cwd = process.cwd();
      return {
        typePaths: [
          join(cwd, 'dist', 'modules', '**', '*.graphql'),
          join(cwd, 'dist', '*.graphql'),
        ],
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        playground: false,
        installSubscriptionHandlers: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: ({ connectionParams }) => connectionParams,
          },
          'subscriptions-transport-ws': {
            onConnect: (connectionParameters) => ({
              connectionParams: connectionParameters,
            }),
          },
        },
        context: ({ req, connectionParams }) => ({ req, connectionParams }),
        introspection: true,
      };
    }
    
    // Development
    return {
      typePaths: [
        join(process.cwd(), 'src', '**', '*.graphql'),
        join(process.cwd(), '*.graphql'),
      ],
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: false,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          onConnect: ({ connectionParams }) => connectionParams,
        },
        'subscriptions-transport-ws': {
          onConnect: (connectionParameters) => ({
            connectionParams: connectionParameters,
          }),
        },
      },
      context: ({ req, connectionParams }) => ({ req, connectionParams }),
      introspection: true,
    };
  },
);
