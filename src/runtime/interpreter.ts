import { RuntimeVal, NumberVal, NullVal } from './values.ts'
import {
  NullLiteral,
  NumericLiteral,
  Stmt,
  Program,
  BinaryExpr,
} from '../frontend/ast.ts'

export function evaluate(astNode: Stmt): RuntimeVal {
  switch (astNode.kind) {
    case 'NumericLiteral':
      return {
        type: 'number',
        value: (astNode as NumericLiteral).value,
      } as NumberVal
    case 'NullLiteral': {
      return {
        type: 'nil',
        value: (astNode as NullLiteral).value,
      } as NullVal
    }
    case 'BinaryExpr':
      return eval_binary_expr(astNode as BinaryExpr)
    case 'Program':
      return eval_program(astNode as Program)
    default:
      console.error('Not implemented yet', astNode)
      Deno.exit(1)
  }
}

function eval_program(program: Program): RuntimeVal {
  let lastEvaluated: RuntimeVal = { type: 'nil', value: 'nil' } as NullVal

  for (const stmt of program.body) {
    lastEvaluated = evaluate(stmt)
  }

  return lastEvaluated
}

function eval_binary_expr(expr: BinaryExpr): RuntimeVal {
  const lhs = evaluate(expr.lhs)
  const rhs = evaluate(expr.rhs)

  if (lhs.type === 'number' && rhs.type === 'number') {
    return eval_numeric_expr(lhs as NumberVal, rhs as NumberVal, expr.operator)
  }

  // One or both are null
  return { type: 'nil', value: 'nil' } as NullVal
}

function eval_numeric_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let res: number

  if (operator == '+') res = lhs.value + rhs.value
  else if (operator == '-') res = lhs.value - rhs.value
  else if (operator == '*') res = lhs.value * rhs.value
  else if (operator == '/')
    // TODO: Division by zero
    res = lhs.value / rhs.value
  else res = lhs.value % rhs.value

  return { type: 'number', value: res }
}
