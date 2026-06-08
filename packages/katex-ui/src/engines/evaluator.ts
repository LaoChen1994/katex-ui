import { arithmeticFunctions } from './functions.js';
import type {
  ArithmeticExpression,
  ArithmeticNode,
  ArithmeticValues,
} from './types.js';

const getNumericValue = (name: string, values: ArithmeticValues): number => {
  const value = values[name];

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  throw new Error(`Variable "${name}" must be numeric.`);
};

const evaluateNode = (
  node: ArithmeticNode,
  values: ArithmeticValues,
): number => {
  if (node.type === 'NumberLiteral') {
    return node.value;
  }

  if (node.type === 'Identifier') {
    return getNumericValue(node.name, values);
  }

  if (node.type === 'UnaryExpression') {
    const value = evaluateNode(node.argument, values);

    return node.operator === '-' ? -value : value;
  }

  if (node.type === 'BinaryExpression') {
    const left = evaluateNode(node.left, values);
    const right = evaluateNode(node.right, values);

    if (node.operator === '+') {
      return left + right;
    }

    if (node.operator === '-') {
      return left - right;
    }

    if (node.operator === '*') {
      return left * right;
    }

    if (node.operator === '/') {
      return left / right;
    }

    if (node.operator === '%') {
      return left % right;
    }

    return left ** right;
  }

  const arithmeticFunction = arithmeticFunctions[node.name];

  if (!arithmeticFunction) {
    throw new Error(`Function "${node.name}" is not allowed.`);
  }

  return arithmeticFunction(
    ...node.args.map((arg) => evaluateNode(arg, values)),
  );
};

export const evaluateArithmeticExpression = (
  expression: ArithmeticExpression,
  values: ArithmeticValues,
): number => evaluateNode(expression.node, values);
