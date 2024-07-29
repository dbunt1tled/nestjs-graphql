import { ObjectType, Field } from '@nestjs/graphql';
import { CreateDateColumn, Entity, PrimaryColumn, Unique } from 'typeorm';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import { Roles } from 'src/roles/enum/roles';

@Entity('roles')
@ObjectType()
@Unique('idx_roles_role_user', ['role', 'user_id'])
export class Role {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => UuidScalar)
  user_id: string;

  @PrimaryColumn({ type: 'varchar', length: 70 })
  @Field()
  role: Roles;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
