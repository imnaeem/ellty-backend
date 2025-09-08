import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { UserSchema } from './user.schema';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { QueryHelpers } from 'src/utils/query-helpers';
import { ModelHelpers } from 'src/utils/model-helpers';
import { ConfigHelpers } from 'src/utils/config-helpers';
import { ModelNames } from 'src/enums';
import { PubSubProvider } from '../pub-sub/pub-sub.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelNames.USER, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [
    UserResolver,
    UserService,
    AuthService,
    UserRepository,
    JwtStrategy,
    QueryHelpers,
    ModelHelpers,
    ConfigHelpers,
    ConfigService,
    PubSubProvider,
  ],
  exports: [UserService, AuthService],
})
export class UserModule {}
