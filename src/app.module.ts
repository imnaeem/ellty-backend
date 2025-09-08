import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { gqlConfig } from './config/gql.config';
import { appConfig } from './config/app.config';
import { databaseConfig } from './config/database.config';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, gqlConfig, databaseConfig],
    }),
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        ...(config.get<ApolloDriverConfig>('gql') as ApolloDriverConfig),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
