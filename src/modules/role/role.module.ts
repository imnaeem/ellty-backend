import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { RoleSchema } from './role.schema';
import { RoleRepository } from './role.repository';
import { QueryHelpers } from 'src/utils/query-helpers';
import { ModelHelpers } from 'src/utils/model-helpers';
import { ConfigHelpers } from 'src/utils/config-helpers';
import { ConfigService } from '@nestjs/config';
import { ModelNames } from 'src/enums';
import { logFindExecutionTimes } from 'src/utils/schema-helpers';

// RoleSchema.plugin(logFindExecutionTimes(ModelNames.ROLE));

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.ROLE, schema: RoleSchema }]),
  ],
  providers: [
    RoleResolver,
    RoleService,
    RoleRepository,
    QueryHelpers,
    ModelHelpers,
    ConfigHelpers,
    ConfigService,
  ],
})
export class RoleModule {}
