import { Parser } from './src/frontend/parser.ts'
import { evaluate } from './src/runtime/interpreter.ts'
import { greet } from './src/utils/log.ts'

function repl() {
  const parser = new Parser()

  greet('Eevee Repl v0.1')

  while (true) {
    const input = prompt('> ')

    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    const program = parser.produceAst(input)
    const res = evaluate(program)
    console.log(res)
  }
}

repl()
