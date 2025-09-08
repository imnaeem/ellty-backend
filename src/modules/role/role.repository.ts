import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GraphQLResolveInfo } from 'graphql';
import { HydratedDocument, Model } from 'mongoose';
import { CreateRoleInput, Role, UserDbObject } from 'src/generated/graphql';
import { ModelHelpers } from 'src/utils/model-helpers';
import { QueryHelpers } from 'src/utils/query-helpers';
import * as graphqlFields from 'graphql-fields';
import { FieldNames, ModelNames } from 'src/enums';

type RolePopulateFields = {
  [FieldNames.USERS]: UserDbObject[];
};

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(ModelNames.ROLE)
    private readonly roleModel: Model<HydratedDocument<Role>>,
    private readonly queryHelpers: QueryHelpers,
    private readonly modelHelpers: ModelHelpers,
  ) {}

  async getRoleById(info: GraphQLResolveInfo, id: string) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);
    const role = await this.modelHelpers.populateVirtuals<Role>(
      id,
      this.roleModel,
      graphQLQuery,
      projection,
    );
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async getAllRoles(info: GraphQLResolveInfo) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);
    return this.modelHelpers.allQueryPopulateVirtuals<Role>(
      {},
      this.roleModel,
      graphQLQuery,
      projection,
    );
  }

  async createNewRole(info: GraphQLResolveInfo, input: CreateRoleInput) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);
    const role = await this.roleModel.create(input);

    return this.modelHelpers.populateVirtuals<Role>(
      role._id.toString(),
      this.roleModel,
      graphQLQuery,
      projection,
    );
  }

  async addUsersToRole(
    info: GraphQLResolveInfo,
    roleId: string,
    userIds: string[],
  ) {
    const graphQLQuery: Record<string, any> = graphqlFields(info);
    const projection = this.queryHelpers.getProjectionFromInfo(info);

    const role = await this.roleModel
      .updateOne(
        { _id: roleId },
        { $addToSet: { userIds: { $each: userIds } } },
      )
      .exec();

    if (!role) throw new NotFoundException('Role not found');

    return this.modelHelpers.populateVirtuals<Role, RolePopulateFields>(
      roleId,
      this.roleModel,
      graphQLQuery,
      projection,
    );
  }
}
