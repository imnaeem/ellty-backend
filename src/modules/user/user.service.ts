import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import {
  CreateUserInput,
  User,
  LoginInput,
  AuthPayload,
} from 'src/generated/graphql';
import { UserRepository } from './user.repository';
import { AuthService } from './auth.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getUser(info: GraphQLResolveInfo, id: string): Promise<User> {
    return this.repository.getUserById(info, id);
  }

  async getUsers(info: GraphQLResolveInfo): Promise<User[]> {
    return this.repository.getAllUsers(info);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const user = await this.repository.createNewUser(input);
    this.pubSub.publish('userCreated', { userCreated: user });
    return user;
  }

  async updateUser(id: string, input: CreateUserInput): Promise<User> {
    return this.repository.updateUserById(id, input);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.deleteUserById(id);
  }

  // Auth-related methods delegated to AuthService
  async login(input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input);
  }

  async register(input: CreateUserInput): Promise<AuthPayload> {
    return this.authService.register(input);
  }

  async validateUser(userId: string): Promise<User> {
    return this.authService.validateUser(userId);
  }

  async getUserProfile(userId: string): Promise<User> {
    return this.repository.findById(userId);
  }
}
