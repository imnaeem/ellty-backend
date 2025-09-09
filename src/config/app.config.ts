import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  // name of this nest app
  name: 'nest-app',
  // version of this nest app
  version: 1.0,
  // build version for nest app (default: development)
  buildVersion: 1.0,
  // port number for nest app (default: 8000, but use PORT env var for production)
  port: process.env.PORT || 8000,
  //Body Size limit set on the api
  bodySizeLimit: '20mb',
  // node.js environment (default: development)
  nodeEnvironment: process.env.NODE_ENV || 'development',
  // URL where frontend app is deployed
  corsOrigin: '*',
  // available endpoints for this nest app
  endpoints: ['graphql'],
  features: {
    // whether gql playground enabled at /graphql endpoint
    playgroundEnabled: true,
  },
}));
