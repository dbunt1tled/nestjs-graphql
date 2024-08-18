import { Field, InputType } from '@nestjs/graphql';
import { UploadGraphQLScalar } from 'src/core/utils/scalars/upload.scalar';
import { FileType } from 'src/modules/files/enum/file-type';
import { FileUpload } from 'graphql-upload';

@InputType()
export class FileCreateInput {
  @Field(() => [UploadGraphQLScalar])
  files: FileUpload[];

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  type?: FileType;
}
