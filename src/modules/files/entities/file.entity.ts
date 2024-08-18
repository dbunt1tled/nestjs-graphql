import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UuidScalar } from 'src/core/utils/scalars/uuid.scalar';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { FileType } from 'src/modules/files/enum/file-type';

@Entity('files')
@Index('idx_files_type', ['type'])
@ObjectType()
export class File {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => UuidScalar)
  id: string;

  @Column({ nullable: true, type: 'uuid' })
  @Field(() => UuidScalar, { nullable: true })
  userId?: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  @Field()
  path: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  type: FileType;

  @ManyToOne(() => User, (user: User) => user.files)
  @Field(() => User)
  user?: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
