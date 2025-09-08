import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunicationResolver } from './communication.resolver';
import { CommunicationService } from './communication.service';
import { CommunicationRepository } from './communication.repository';
import { CalculationRepository } from './calculation.repository';
import { CommunicationSchema } from './communication.schema';
import { CalculationSchema } from './calculation.schema';
import { QueryHelpers } from 'src/utils/query-helpers';
import { ModelHelpers } from 'src/utils/model-helpers';
import { ConfigHelpers } from 'src/utils/config-helpers';
import { ConfigService } from '@nestjs/config';
import { ModelNames } from 'src/enums';
import { PubSubProvider } from '../pub-sub/pub-sub.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelNames.COMMUNICATION, schema: CommunicationSchema },
      { name: ModelNames.CALCULATION, schema: CalculationSchema },
    ]),
    UserModule,
  ],
  providers: [
    CommunicationResolver,
    CommunicationService,
    CommunicationRepository,
    CalculationRepository,
    QueryHelpers,
    ModelHelpers,
    ConfigHelpers,
    ConfigService,
    PubSubProvider,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
