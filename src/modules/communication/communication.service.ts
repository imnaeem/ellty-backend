import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { 
  Communication, 
  Calculation, 
  CreateCommunicationInput, 
  AddCalculationInput,
  Operation 
} from 'src/generated/graphql';
import { CommunicationRepository } from './communication.repository';
import { CalculationRepository } from './calculation.repository';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.provider';

@Injectable()
export class CommunicationService {
  constructor(
    private readonly communicationRepository: CommunicationRepository,
    private readonly calculationRepository: CalculationRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getCommunication(info: GraphQLResolveInfo, id: string): Promise<Communication> {
    const communication = await this.communicationRepository.getCommunicationById(info, id);
    if (!communication) {
      throw new NotFoundException('Communication not found');
    }
    return communication;
  }

  async getAllCommunications(info: GraphQLResolveInfo): Promise<Communication[]> {
    return this.communicationRepository.getAllCommunications(info);
  }

  async getCommunicationCalculations(info: GraphQLResolveInfo, communicationId: string): Promise<Calculation[]> {
    return this.calculationRepository.getCalculationsByCommunciationId(info, communicationId);
  }

  async createCommunication(info: GraphQLResolveInfo, input: CreateCommunicationInput, authorId: string): Promise<Communication> {
    // Validate starting number
    if (typeof input.startingNumber !== 'number' || isNaN(input.startingNumber)) {
      throw new BadRequestException(`Invalid starting number: ${input.startingNumber}`);
    }

    const communication = await this.communicationRepository.createCommunication(info, {
      ...input,
      authorId: authorId,
    });

    // Publish subscription
    this.pubSub.publish('communicationCreated', { communicationCreated: communication });

    return communication;
  }

  async addCalculation(info: GraphQLResolveInfo, input: AddCalculationInput, authorId: string): Promise<Calculation> {
    // Validate communication exists - get it directly without GraphQL field selection
    const communication = await this.communicationRepository.getCommunicationById(info, input.communicationId);
    if (!communication) {
      throw new NotFoundException('Communication not found');
    }


    // Get the left operand (previous result or starting number)
    let leftOperand: number;
    
    if (input.parentCalculationId) {
      const parentCalculation = await this.calculationRepository.getCalculationById(input.parentCalculationId);
      if (!parentCalculation) {
        throw new NotFoundException('Parent calculation not found');
      }
      leftOperand = parentCalculation.result;
    } else {
      // Use the latest calculation result, or starting number if no calculations
      const lastCalculation = await this.calculationRepository.getLastCalculationForCommunication(input.communicationId);
      leftOperand = lastCalculation ? lastCalculation.result : communication.startingNumber;
    }


    // Calculate result
    const result = this.performCalculation(leftOperand, input.operation, input.rightOperand);


    // Create calculation
    const calculation = await this.calculationRepository.createCalculation(info, {
      leftOperand,
      operation: input.operation,
      rightOperand: input.rightOperand,
      result,
      authorId: authorId,
      communicationId: input.communicationId,
      parentCalculationId: input.parentCalculationId,
    });

    // Update communication metadata
    await this.updateCommunicationMetadata(input.communicationId, result, authorId);

    // Publish subscriptions
    this.pubSub.publish(`calculationAdded_${input.communicationId}`, { 
      calculationAdded: calculation 
    });

    const updatedCommunication = await this.communicationRepository.getCommunicationById(info,
      input.communicationId
    );
    this.pubSub.publish(`communicationUpdated_${input.communicationId}`, { 
      communicationUpdated: updatedCommunication 
    });

    return calculation;
  }

  private performCalculation(left: number, operation: Operation, right: number): number {
    switch (operation) {
      case Operation.Add:
        return left + right;
      case Operation.Subtract:
        return left - right;
      case Operation.Multiply:
        return left * right;
      case Operation.Divide:
        if (right === 0) {
          throw new BadRequestException('Division by zero is not allowed');
        }
        return left / right;
      default:
        throw new BadRequestException('Invalid operation');
    }
  }

  private async updateCommunicationMetadata(communicationId: string, newResult: number, authorId: string): Promise<void> {
    // Update calculation count
    await this.communicationRepository.incrementCalculationCount(communicationId);
    
    // Update current result
    await this.communicationRepository.updateCurrentResult(communicationId, newResult);
    
    // Update participant count
    const allParticipants = await this.calculationRepository.getUniqueParticipants(communicationId);
    if (!allParticipants.includes(authorId)) {
      allParticipants.push(authorId);
    }
    await this.communicationRepository.updateParticipantCount(communicationId, allParticipants);
  }
}
