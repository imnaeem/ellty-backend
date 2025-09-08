import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLResolveInfo } from 'graphql';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Calculation, Communication, CreateCommunicationInput } from 'src/generated/graphql';
import { ModelHelpers } from 'src/utils/model-helpers';
import { QueryHelpers } from 'src/utils/query-helpers';
import * as graphqlFields from 'graphql-fields';
import { ModelNames } from 'src/enums';

const commGraphQLQuery: Record<string, any> = {
  id: {},
  startingNumber: {},
  title: {},
  currentResult: {},
  calculationCount: {},
  participantCount: {},
  createdAt: {},
  updatedAt: {},
  calculations: {
    id: {},
    leftOperand: {},
    operation: {},
    rightOperand: {},
    result: {},
    createdAt: {},
    parentCalculationId: {},
    author: {
      id: {},
      username: {},
      email: {},
      isActive: {},
      createdAt: {},
      updatedAt: {},
      __typename: {}
    },
    __typename: {}
  },
  author: {
    id: {},
    username: {},
    email: {},
    isActive: {},
    createdAt: {},
    updatedAt: {},
    __typename: {}
  },
  __typename: {}
}
const commProjection = [
  'id',
  'startingNumber',
  'title',
  'currentResult',
  'calculationCount',
  'participantCount',
  'createdAt',
  'updatedAt',
  '_id',
  'authorId'
]

@Injectable()
export class CommunicationRepository {
  constructor(
    @InjectModel(ModelNames.COMMUNICATION)
    private readonly communicationModel: Model<HydratedDocument<Communication>>,
    @InjectModel(ModelNames.CALCULATION)
    private readonly calculationModel: Model<HydratedDocument<Calculation>>,
    private readonly queryHelpers: QueryHelpers,
    private readonly modelHelpers: ModelHelpers,
  ) {}

  async getCommunicationById(info: GraphQLResolveInfo, id: string): Promise<Communication> {
    // const graphQLQuery: Record<string, any> = graphqlFields(info);
    // const projection = this.queryHelpers.getProjectionFromInfo(info);
    return this.modelHelpers.populateVirtuals<Communication>(
      id,
      this.communicationModel,
      commGraphQLQuery,
      commProjection,
    );
  }

  async getAllCommunications(info: GraphQLResolveInfo): Promise<Communication[]> {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);

    return this.modelHelpers.allQueryPopulateVirtuals<Communication>(
      {},
      this.communicationModel,
      graphQLQuery,
      projection,
    );
  }

  async createCommunication(info: GraphQLResolveInfo, input: CreateCommunicationInput & { authorId: string }): Promise<Communication> {
    const communication = await this.communicationModel.create({
      ...input,
      currentResult: input.startingNumber,
      calculationCount: 0,
      participantCount: 1,
    });

    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);

    return this.modelHelpers.populateVirtuals<Communication>(
      communication._id.toString(),
      this.communicationModel,
      graphQLQuery,
      projection,
    );

  }

  async updateCommunication(id: string, updates: Partial<Communication>): Promise<Communication> {
    return this.communicationModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async incrementCalculationCount(communicationId: string): Promise<void> {
    await this.communicationModel.findByIdAndUpdate(
      communicationId,
      { 
        $inc: { calculationCount: 1 },
        $set: { updatedAt: new Date() }
      }
    ).exec();
  }

  async updateParticipantCount(communicationId: string, participantIds: string[]): Promise<void> {
    await this.communicationModel.findByIdAndUpdate(
      communicationId,
      { 
        participantCount: participantIds.length,
        updatedAt: new Date()
      }
    ).exec();
  }

  async updateCurrentResult(communicationId: string, result: number): Promise<void> {
    await this.communicationModel.findByIdAndUpdate(
      communicationId,
      { 
        currentResult: result,
        updatedAt: new Date()
      }
    ).exec();
  }
}
