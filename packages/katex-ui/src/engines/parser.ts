import { tokenizeArithmeticExpression } from './tokens.js';
import { collectArithmeticUsage } from './usage.js';
import type {
  ArithmeticExpression,
  ArithmeticNode,
  ArithmeticToken,
} from './types.js';

export const parseArithmeticExpression = (
  expression: string,
): ArithmeticExpression => {
  const tokens = tokenizeArithmeticExpression(expression);
  let index = 0;

  const currentToken = (): ArithmeticToken =>
    tokens[index] ?? { type: 'eof', value: '' };

  const consumeToken = (): ArithmeticToken => {
    const token = currentToken();
    index += 1;
    return token;
  };

  const parsePrimary = (): ArithmeticNode => {
    const token = consumeToken();

    if (token.type === 'number') {
      return {
        type: 'NumberLiteral',
        value: Number(token.value),
      };
    }

    if (token.type === 'identifier') {
      if (currentToken().type === 'paren' && currentToken().value === '(') {
        consumeToken();

        const args: ArithmeticNode[] = [];

        if (currentToken().type !== 'paren' || currentToken().value !== ')') {
          while (true) {
            args.push(parseAdditive());

            if (currentToken().type !== 'comma') {
              break;
            }

            consumeToken();
          }
        }

        if (currentToken().type !== 'paren' || currentToken().value !== ')') {
          throw new Error(
            'Formula function call is missing a closing parenthesis.',
          );
        }

        consumeToken();

        return {
          args,
          name: token.value,
          type: 'CallExpression',
        };
      }

      return {
        name: token.value,
        type: 'Identifier',
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      const node = parseAdditive();

      if (currentToken().type !== 'paren' || currentToken().value !== ')') {
        throw new Error('Formula group is missing a closing parenthesis.');
      }

      consumeToken();
      return node;
    }

    throw new Error('Formula expression is invalid.');
  };

  const parseUnary = (): ArithmeticNode => {
    const token = currentToken();

    if (
      token.type === 'operator' &&
      (token.value === '+' || token.value === '-')
    ) {
      consumeToken();

      return {
        argument: parseUnary(),
        operator: token.value,
        type: 'UnaryExpression',
      };
    }

    return parsePrimary();
  };

  const parsePower = (): ArithmeticNode => {
    const left = parseUnary();

    if (currentToken().type === 'operator' && currentToken().value === '^') {
      const operator = consumeToken().value;

      return {
        left,
        operator,
        right: parsePower(),
        type: 'BinaryExpression',
      };
    }

    return left;
  };

  const parseMultiplicative = (): ArithmeticNode => {
    let node = parsePower();

    while (
      currentToken().type === 'operator' &&
      ['*', '/', '%'].includes(currentToken().value)
    ) {
      const operator = consumeToken().value;

      node = {
        left: node,
        operator,
        right: parsePower(),
        type: 'BinaryExpression',
      };
    }

    return node;
  };

  const parseAdditive = (): ArithmeticNode => {
    let node = parseMultiplicative();

    while (
      currentToken().type === 'operator' &&
      ['+', '-'].includes(currentToken().value)
    ) {
      const operator = consumeToken().value;

      node = {
        left: node,
        operator,
        right: parseMultiplicative(),
        type: 'BinaryExpression',
      };
    }

    return node;
  };

  const node = parseAdditive();

  if (currentToken().type !== 'eof') {
    throw new Error('Formula expression has unexpected trailing input.');
  }

  return {
    node,
    ...collectArithmeticUsage(node),
  };
};
