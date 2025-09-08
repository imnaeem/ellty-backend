import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  Info,
  Context,
} from '@nestjs/graphql';
import { UseGuards, Inject } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { CommunicationService } from './communication.service';
import { GqlAuthGuard } from '../user/gql-auth.guard';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';
import { AuthenticatedContext } from 'src/types/graphql-context';
import {
  CreateCommunicationInput,
  AddCalculationInput,
} from 'src/generated/graphql';

@Resolver()
export class CommunicationResolver {
  constructor(
    private readonly communicationService: CommunicationService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query()
  communication(@Info() info: GraphQLResolveInfo, @Args() args: { id: string }) {
    return this.communicationService.getCommunication(info, args.id);
  }

  @Query()
  allCommunications(@Info() info: GraphQLResolveInfo) {
    return this.communicationService.getAllCommunications(info);
  }

  @Query()
  communicationCalculations(@Info() info: GraphQLResolveInfo, @Args() args: { communicationId: string }) {
    return this.communicationService.getCommunicationCalculations(info, args.communicationId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  createCommunication(
    @Args('input') input: CreateCommunicationInput,
    @Info() info: GraphQLResolveInfo,
    @Context() context: AuthenticatedContext,
  ) {
    const userId = context.req.user.id;
    return this.communicationService.createCommunication(info, input, userId);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  addCalculation(
    @Args('input') input: AddCalculationInput,
    @Info() info: GraphQLResolveInfo, 
    @Context() context: AuthenticatedContext,
  ) {
    const userId = context.req.user.id;
    return this.communicationService.addCalculation(info, input, userId);
  }

  @Subscription()
  communicationCreated() {
    return this.pubSub.asyncIterableIterator('communicationCreated');
  }

  @Subscription()
  calculationAdded(@Args() args: { communicationId: string }) {
    return this.pubSub.asyncIterableIterator(`calculationAdded_${args.communicationId}`);
  }

  @Subscription()
  communicationUpdated(@Args() args: { communicationId: string }) {
    return this.pubSub.asyncIterableIterator(`communicationUpdated_${args.communicationId}`);
  }
}
