import { ApolloDriverConfig } from '@nestjs/apollo';
import { registerAs } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

export const gqlConfig = registerAs(
  'gql',
  (): ApolloDriverConfig => ({
    typePaths: ['./**/*.graphql'],
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    playground: false, // disable default graphQL playground
    installSubscriptionHandlers: true,
    subscriptions: {
      'graphql-ws': {
        onConnect: ({ connectionParams }) => connectionParams,
      },
      'subscriptions-transport-ws': {
        onConnect: (connectionParameters) => ({
          connectionParams: connectionParameters,
        }), // return http headers
      },
    },
    context: ({ req, connectionParams }) => ({ req, connectionParams }),
    introspection: true,
  }),
);
