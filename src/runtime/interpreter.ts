import { RuntimeVal, NumberVal, MK_NULL, MK_NUMBER } from './values.ts'
import {
  NumericLiteral,
  Identifier,
  Stmt,
  Program,
  BinaryExpr,
} from '../frontend/ast.ts'
import Environment from './environment.ts'
import { RuntimeError } from '../utils/error.ts'
import { error, runtimeError } from '../utils/log.ts'

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case 'NumericLiteral':
      return MK_NUMBER((astNode as NumericLiteral).value)
    case 'Identifier':
      return eval_identifier(astNode as Identifier, env)
    case 'BinaryExpr':
      return eval_binary_expr(astNode as BinaryExpr, env)
    case 'Program':
      return eval_program(astNode as Program, env)
    default:
      console.error('Not implemented yet', astNode)
      Deno.exit(1)
  }
}

function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL()
  try {
    for (const stmt of program.body) {
      lastEvaluated = evaluate(stmt, env)
    }

    return lastEvaluated
  } catch (err) {
    if (err instanceof RuntimeError) runtimeError(err.message)
    else error('Unexpected error')
    Deno.exit(1)
  }
}

function eval_binary_expr(expr: BinaryExpr, env: Environment): RuntimeVal {
  const lhs = evaluate(expr.lhs, env)
  const rhs = evaluate(expr.rhs, env)

  if (lhs.type === 'number' && rhs.type === 'number') {
    return eval_numeric_expr(lhs as NumberVal, rhs as NumberVal, expr.operator)
  }

  // One or both are null
  return MK_NULL()
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

function eval_identifier(expr: Identifier, env: Environment): RuntimeVal {
  const val = env.lookupVar(expr.symbol)
  return val
}
