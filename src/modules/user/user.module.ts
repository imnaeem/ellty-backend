import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { QueryHelpers } from 'src/utils/query-helpers';
import { ModelHelpers } from 'src/utils/model-helpers';
import { ConfigHelpers } from 'src/utils/config-helpers';
import { ConfigService } from '@nestjs/config';
import { ModelNames } from 'src/enums';
import { RoleSchema } from '../role/role.schema';
import { PubSubProvider } from '../pub-sub/pub-sub.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ModelNames.ROLE, schema: RoleSchema }]),
  ],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    QueryHelpers,
    ModelHelpers,
    ConfigHelpers,
    ConfigService,
    PubSubProvider,
  ],
})
export class UserModule {}
