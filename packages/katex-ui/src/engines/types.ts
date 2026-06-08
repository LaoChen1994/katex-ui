export type ArithmeticTokenType =
  | 'comma'
  | 'eof'
  | 'identifier'
  | 'number'
  | 'operator'
  | 'paren';

export type ArithmeticToken = {
  type: ArithmeticTokenType;
  value: string;
};

export type ArithmeticNode =
  | {
      type: 'BinaryExpression';
      left: ArithmeticNode;
      operator: string;
      right: ArithmeticNode;
    }
  | {
      type: 'CallExpression';
      args: ArithmeticNode[];
      name: string;
    }
  | {
      type: 'Identifier';
      name: string;
    }
  | {
      type: 'NumberLiteral';
      value: number;
    }
  | {
      argument: ArithmeticNode;
      operator: string;
      type: 'UnaryExpression';
    };

export type ArithmeticExpression = {
  functions: string[];
  node: ArithmeticNode;
  variables: string[];
};

export type ArithmeticValue = number | string | boolean | null | undefined;

export type ArithmeticValues = Record<string, ArithmeticValue>;
