import { GraphQLScalarType } from 'graphql/type';
import { validate as validateUuid } from 'uuid';
import { Kind } from 'graphql/index';

function validate(uuid: unknown): string | never {
  if (typeof uuid !== 'string' || !validateUuid(uuid)) {
    throw new Error('invalid uuid');
  }
  return uuid;
}

export const UuidScalar = new GraphQLScalarType({
  name: 'UUID',
  description: 'UUID scalar type',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast) => validate(ast.kind === Kind.INT ? ast.value : null),
});
