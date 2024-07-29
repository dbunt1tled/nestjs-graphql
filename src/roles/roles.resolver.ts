import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from 'src/roles/entities/role.entity';
import { RoleCreateInput } from 'src/roles/dto/role-create.input';
import { RoleListInput } from 'src/roles/dto/role-list.input';
import { RolesFilter } from 'src/roles/repository/roles.filter';
import { RoleRemoveInput } from 'src/roles/dto/role-remove.input';
import { RolesService } from 'src/roles/roles.service';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly roleService: RolesService) {}

  @Mutation(() => Role)
  roleCreate(@Args('role') role: RoleCreateInput) {
    return this.roleService.new(role);
  }

  @Query(() => [Role], { name: 'roles' })
  roleList(@Args('role') role: RoleListInput) {
    return this.roleService.list(
      new RolesFilter({
        filter: {
          userId: role.userId,
          role: role.role,
        },
      }),
    );
  }

  @Mutation(() => Role)
  removeRole(@Args('role') role: RoleRemoveInput) {
    return this.roleService.remove(role.userId, role.role);
  }
}
