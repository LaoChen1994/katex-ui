# Core API

## `extractVariables(expression)`

从公式表达式中提取变量名。

## `validateFormula(expression)`

校验公式语法，返回 `{ valid, errors }`。

## `calculateFormula(expression, values)`

计算公式，返回 `{ value, errors }`。第一期结果限定为有限数字。
