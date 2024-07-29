import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from 'src/users/enum/user.status';
import { Role } from 'src/roles/entities/role.entity';

@Entity('users')
@ObjectType()
@Index('idx_user_status', ['status'])
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => UuidScalar)
  id: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 200 })
  @Field()
  hash: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  @Field({ nullable: true })
  name?: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  status: UserStatus;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @JoinTable()
  @OneToMany(() => Role, (role) => role.user_id)
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
