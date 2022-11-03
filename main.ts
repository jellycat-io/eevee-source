import { Parser } from './src/frontend/parser.ts'
import Environment from './src/runtime/environment.ts'
import { evaluate } from './src/runtime/interpreter.ts'
import { MK_NULL, MK_BOOL, MK_NUMBER } from './src/runtime/values.ts'
import { greet } from './src/utils/log.ts'

function repl() {
  const parser = new Parser()
  const env = new Environment()
  env.declareVar('true', MK_BOOL(true))
  env.declareVar('false', MK_BOOL(false))
  env.declareVar('nil', MK_NULL())
  env.declareVar('PI', MK_NUMBER(3.14))

  greet('Eevee Repl v0.1')

  while (true) {
    const input = prompt('> ')

    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    const program = parser.produceAst(input)
    const res = evaluate(program, env)
    console.log(res)
  }
}

repl()
