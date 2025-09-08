import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLResolveInfo } from 'graphql';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserInput, User } from 'src/generated/graphql';
import { ModelHelpers } from 'src/utils/model-helpers';
import { QueryHelpers } from 'src/utils/query-helpers';
import * as graphqlFields from 'graphql-fields';
import { ModelNames } from 'src/enums';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(ModelNames.USER)
    private readonly userModel: Model<HydratedDocument<User>>,
    private readonly queryHelpers: QueryHelpers,
    private readonly modelHelpers: ModelHelpers,
  ) {}

  async getUserById(info: GraphQLResolveInfo, id: string) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);
    return this.modelHelpers.populateVirtuals<User>(
      id,
      this.userModel,
      graphQLQuery,
      projection,
    );
  }

  async getAllUsers(info: GraphQLResolveInfo) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);

    return this.modelHelpers.allQueryPopulateVirtuals<User>(
      {},
      this.userModel,
      graphQLQuery,
      projection,
    );
  }

  async createNewUser(input: CreateUserInput) {
    const newUser = new this.userModel(input);
    return newUser.save();
  }

  async updateUserById(id: string, input: CreateUserInput) {
    return this.userModel.findByIdAndUpdate(id, input, { new: true }).exec();
  }

  async deleteUserById(id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return this.userModel.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
