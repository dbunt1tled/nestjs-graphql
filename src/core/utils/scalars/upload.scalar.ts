import { Scalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@Scalar('Upload')
export class UploadGraphQLScalar {
  protected parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  protected serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  protected parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}
