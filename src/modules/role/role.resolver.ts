import { Resolver, Args, Mutation, Query, Info } from '@nestjs/graphql';
import { RoleService } from './role.service';
import {
  QueryResolvers,
  MutationResolvers,
  QueryUserArgs,
  CreateRoleInput,
  MutationAddUsersToRoleArgs,
  MutationCreateRoleArgs,
} from 'src/generated/graphql';
import { GraphQLResolveInfo } from 'graphql';

@Resolver()
export class RoleResolver implements QueryResolvers, MutationResolvers {
  constructor(private readonly roleService: RoleService) {}

  @Query()
  role(@Info() info: GraphQLResolveInfo, @Args() args: QueryUserArgs) {
    const { id } = args;
    return this.roleService.getRole(info, id);
  }

  @Query()
  allRoles(@Info() info: GraphQLResolveInfo) {
    return this.roleService.getRoles(info);
  }

  @Mutation()
  createRole(
    @Info() info: GraphQLResolveInfo,
    @Args() args: MutationCreateRoleArgs,
  ) {
    const { input } = args;
    return this.roleService.createRole(info, input);
  }

  @Mutation()
  addUsersToRole(
    @Info() info: GraphQLResolveInfo,
    @Args() args: MutationAddUsersToRoleArgs,
  ) {
    const { roleId, userIds } = args;
    return this.roleService.addUsersToRole(info, roleId, userIds);
  }
}
