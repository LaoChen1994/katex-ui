import { arithmeticFunctions } from './functions.js';
import type { ArithmeticNode } from './types.js';

const pushUnique = (values: string[], value: string): void => {
  if (!values.includes(value)) {
    values.push(value);
  }
};

export const collectArithmeticUsage = (
  node: ArithmeticNode,
): { functions: string[]; variables: string[] } => {
  const functions: string[] = [];
  const variables: string[] = [];

  const collectNodeUsage = (nodeValue: ArithmeticNode): void => {
    if (nodeValue.type === 'Identifier') {
      pushUnique(variables, nodeValue.name);
      return;
    }

    if (nodeValue.type === 'CallExpression') {
      pushUnique(functions, nodeValue.name);

      if (!arithmeticFunctions[nodeValue.name]) {
        pushUnique(variables, nodeValue.name);
      }

      for (const arg of nodeValue.args) {
        collectNodeUsage(arg);
      }

      return;
    }

    if (nodeValue.type === 'UnaryExpression') {
      collectNodeUsage(nodeValue.argument);
      return;
    }

    if (nodeValue.type === 'BinaryExpression') {
      collectNodeUsage(nodeValue.left);
      collectNodeUsage(nodeValue.right);
    }
  };

  collectNodeUsage(node);

  return {
    functions,
    variables,
  };
};
