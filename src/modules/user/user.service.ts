import { Inject, Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { CreateUserInput, User } from 'src/generated/graphql';
import { UserRepository } from './user.repository';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
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
}
