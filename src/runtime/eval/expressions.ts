import { AssignmentExpr, BinaryExpr, Identifier } from '../../frontend/ast.ts';
import Environment from '../environment.ts';
import { MK_NULL, NumberVal, RuntimeVal } from '../values.ts';
import { evaluate } from '../interpreter.ts';
import { RuntimeError } from '../../utils/error.ts';

export function eval_assignment_expr(
  expr: AssignmentExpr,
  env: Environment,
): RuntimeVal {
  if (expr.assignee.kind !== 'Identifier') {
    throw new RuntimeError(
      `Invalid identifier ${JSON.stringify(expr.assignee)}`,
    );
  }
  const varname = (expr.assignee as Identifier).symbol;
  return env.assignVar(varname, evaluate(expr.value, env));
}

export function eval_binary_expr(
  expr: BinaryExpr,
  env: Environment,
): RuntimeVal {
  const lhs = evaluate(expr.lhs, env);
  const rhs = evaluate(expr.rhs, env);

  if (lhs.type === 'number' && rhs.type === 'number') {
    return eval_numeric_expr(lhs as NumberVal, rhs as NumberVal, expr.operator);
  }

  // One or both are null
  return MK_NULL();
}

export function eval_identifier(
  expr: Identifier,
  env: Environment,
): RuntimeVal {
  const val = env.lookupVar(expr.symbol);
  return val;
}

function eval_numeric_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string,
): NumberVal {
  let res: number;

  if (operator == '+') res = lhs.value + rhs.value;
  else if (operator == '-') res = lhs.value - rhs.value;
  else if (operator == '*') res = lhs.value * rhs.value;
  else if (operator == '/') {
    // TODO: Division by zero
    res = lhs.value / rhs.value;
  } else res = lhs.value % rhs.value;

  return { type: 'number', value: res };
}
