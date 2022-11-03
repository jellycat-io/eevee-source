import { Parser } from '../src/frontend/parser.ts'
import Environment from '../src/runtime/environment.ts'
import { evaluate } from '../src/runtime/interpreter.ts'

const parser = new Parser()

export function compileSource(input: string, env: Environment) {
  const program = parser.produceAst(input)
  return evaluate(program, env)
}
