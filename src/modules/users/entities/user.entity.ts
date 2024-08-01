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
import { UserStatus } from 'src/modules/users/enum/user.status';
import { Role } from 'src/modules/roles/entities/role.entity';
import { JoinColumn } from 'typeorm/decorator/relations/JoinColumn';

@Entity('users')
@ObjectType()
@Index('idx_user_status', ['status'])
@Index('idx_user_session', ['session'])
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

  @Column({ nullable: true, type: 'varchar', length: 100 })
  @Field({ nullable: true })
  session?: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  confirmedAt?: Date;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @OneToMany(() => Role, (role: Role) => role.userId)
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
