import { Program, VarDeclaration } from '../../frontend/ast.ts'
import Environment from '../environment.ts'
import { RuntimeVal, MK_NULL } from '../values.ts'
import { RuntimeError } from '../../utils/error.ts'
import { error } from '../../utils/log.ts'
import { evaluate } from '../interpreter.ts'

export function eval_program(program: Program, env: Environment): RuntimeVal {
  let lastEvaluated: RuntimeVal = MK_NULL()
  try {
    for (const stmt of program.body) {
      lastEvaluated = evaluate(stmt, env)
    }

    return lastEvaluated
  } catch (err) {
    if (err instanceof RuntimeError) error(err.getErrorMessage())
    else error('Unexpected Runtime Error')
    Deno.exit(1)
  }
}

export function eval_var_declaration(
  decl: VarDeclaration,
  env: Environment
): RuntimeVal {
  const value = decl.value ? evaluate(decl.value, env) : MK_NULL()
  return env.declareVar(decl.identifier, value, decl.constant)
}
