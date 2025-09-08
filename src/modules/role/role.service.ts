import { Injectable } from '@nestjs/common';
import { GraphQLResolveInfo } from 'graphql';
import { CreateRoleInput, Role } from 'src/generated/graphql';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private readonly repository: RoleRepository) {}

  async getRole(info: GraphQLResolveInfo, id: string): Promise<Role> {
    return this.repository.getRoleById(info, id);
  }

  async createRole(
    info: GraphQLResolveInfo,
    input: CreateRoleInput,
  ): Promise<Role> {
    return this.repository.createNewRole(info, input);
  }

  async getRoles(info: GraphQLResolveInfo): Promise<Role[]> {
    return this.repository.getAllRoles(info);
  }

  async addUsersToRole(
    info: GraphQLResolveInfo,
    roleId: string,
    userIds: string[],
  ): Promise<Role> {
    return this.repository.addUsersToRole(info, roleId, userIds);
  }
}
