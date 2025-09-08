import {
  Resolver,
  Args,
  Mutation,
  Query,
  Info,
  Subscription,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  CreateUserInput,
  QueryResolvers,
  MutationResolvers,
  MutationUpdateUserArgs,
  QueryUserArgs,
} from 'src/generated/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';

@Resolver()
export class UserResolver implements QueryResolvers, MutationResolvers {
  constructor(
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query()
  user(@Info() info: GraphQLResolveInfo, @Args() args: QueryUserArgs) {
    const { id } = args;
    return this.userService.getUser(info, id);
  }

  @Query()
  allUsers(@Info() info: GraphQLResolveInfo) {
    return this.userService.getUsers(info);
  }

  @Mutation()
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation()
  updateUser(@Args() args: MutationUpdateUserArgs) {
    const { id, input } = args;
    return this.userService.updateUser(id, input);
  }

  @Mutation()
  deleteUser(@Args('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Subscription()
  userCreated() {
    return this.pubSub.asyncIterableIterator('userCreated');
  }
}
