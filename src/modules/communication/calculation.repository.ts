

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLResolveInfo } from 'graphql';
import { HydratedDocument, Model } from 'mongoose';
import {
  Calculation,
  Operation,
} from 'src/generated/graphql';
import { ModelHelpers } from 'src/utils/model-helpers';
import { QueryHelpers } from 'src/utils/query-helpers';
import * as graphqlFields from 'graphql-fields';
import { ModelNames } from 'src/enums';

@Injectable()
export class CalculationRepository {
  constructor(
    @InjectModel(ModelNames.CALCULATION)
    private readonly calculationModel: Model<HydratedDocument<Calculation>>,
    private readonly queryHelpers: QueryHelpers,
    private readonly modelHelpers: ModelHelpers,
  ) {}

  async getCalculationsByCommunciationId(
    info: GraphQLResolveInfo,
    communicationId: string,
  ): Promise<Calculation[]> {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);

    return this.modelHelpers.allQueryPopulateVirtuals<Calculation>(
      { communicationId: communicationId },
      this.calculationModel,
      graphQLQuery,
      projection,
    );
  }

  async createCalculation(info: GraphQLResolveInfo,data: {
    leftOperand: number;
    operation: Operation;
    rightOperand: number;
    result: number;
    authorId: string;
    communicationId: string;
    parentCalculationId?: string;
  }): Promise<Calculation> {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);
    const calculation = await this.calculationModel.create(data);
    return this.modelHelpers.populateVirtuals<Calculation>(
      calculation._id.toString(),
      this.calculationModel,
      graphQLQuery,
      projection,
    );
  }

  async getLastCalculationForCommunication(communicationId: string): Promise<Calculation | null> {
    return this.calculationModel
      .findOne({ communicationId: communicationId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getUniqueParticipants(
    communicationId: string,
  ): Promise<string[]> {
    const participants = await this.calculationModel
      .distinct('authorId', { communicationId: communicationId })
      .exec();
    return participants.map((id) => id.toString());
  }

  async getCalculationById(id: string): Promise<Calculation | null> {
    return this.calculationModel.findById(id).exec();
  }
}
