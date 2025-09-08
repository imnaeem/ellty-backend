import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PubSub } from 'graphql-subscriptions';

export const PUB_SUB = 'PUB_SUB';

export const PubSubProvider: Provider<PubSub> = {
  provide: PUB_SUB,
  useFactory: (config: ConfigService) => {
    return new PubSub();
  },
  inject: [ConfigService],
};
