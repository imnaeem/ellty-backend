import {
  Resolver,
  Args,
  Mutation,
  Query,
  Info,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  CreateUserInput,
  LoginInput,
  QueryResolvers,
  MutationResolvers,
  MutationUpdateUserArgs,
  QueryUserArgs,
} from 'src/generated/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';
import { GraphQLContext } from 'src/types/graphql-context';

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

  @Mutation()
  login(@Args('input') input: LoginInput) {
    return this.userService.login(input);
  }

  @Mutation()
  register(@Args('input') input: CreateUserInput) {
    return this.userService.register(input);
  }

  @Query()
  me(@Context() context: GraphQLContext) {
    // This will be protected by auth guard
    const userId = context.req.user?.id;
    return this.userService.getUserProfile(userId);
  }

  @Subscription()
  userCreated() {
    return this.pubSub.asyncIterableIterator('userCreated');
  }
}
