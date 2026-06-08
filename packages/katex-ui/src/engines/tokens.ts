import type { ArithmeticToken } from './types.js';

const isDigit = (char: string): boolean => char >= '0' && char <= '9';

export const isIdentifierStart = (char: string): boolean =>
  (char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || char === '_';

const isIdentifierPart = (char: string): boolean =>
  isIdentifierStart(char) || isDigit(char);

export const tokenizeArithmeticExpression = (
  expression: string,
): ArithmeticToken[] => {
  const tokens: ArithmeticToken[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index] ?? '';

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (isDigit(char) || char === '.') {
      let endIndex = index;
      let hasDot = false;

      while (endIndex < expression.length) {
        const nextChar = expression[endIndex] ?? '';

        if (nextChar === '.') {
          if (hasDot) {
            break;
          }

          hasDot = true;
          endIndex += 1;
          continue;
        }

        if (!isDigit(nextChar)) {
          break;
        }

        endIndex += 1;
      }

      const value = expression.slice(index, endIndex);

      if (value === '.') {
        throw new Error('Formula number is invalid.');
      }

      tokens.push({
        type: 'number',
        value,
      });
      index = endIndex;
      continue;
    }

    if (isIdentifierStart(char)) {
      let endIndex = index + 1;

      while (
        endIndex < expression.length &&
        isIdentifierPart(expression[endIndex] ?? '')
      ) {
        endIndex += 1;
      }

      tokens.push({
        type: 'identifier',
        value: expression.slice(index, endIndex),
      });
      index = endIndex;
      continue;
    }

    if ('+-*/%^'.includes(char)) {
      tokens.push({
        type: 'operator',
        value: char,
      });
      index += 1;
      continue;
    }

    if (char === '(' || char === ')') {
      tokens.push({
        type: 'paren',
        value: char,
      });
      index += 1;
      continue;
    }

    if (char === ',') {
      tokens.push({
        type: 'comma',
        value: char,
      });
      index += 1;
      continue;
    }

    throw new Error(`Unexpected token "${char}".`);
  }

  tokens.push({
    type: 'eof',
    value: '',
  });

  return tokens;
};
