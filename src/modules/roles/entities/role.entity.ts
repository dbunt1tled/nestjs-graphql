import { ObjectType, Field } from '@nestjs/graphql';
import { CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import { Roles } from 'src/modules/roles/enum/roles';

@Entity('roles')
@ObjectType()
@Unique('idx_roles_role_user', ['role', 'userId'])
export class Role {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => UuidScalar)
  userId: string;

  @PrimaryColumn({ type: 'varchar', length: 70 })
  @Field()
  role: Roles;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
