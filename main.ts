import { Parser } from './src/parser.ts'
import { greet, log } from './src/log.ts'

function repl() {
  const parser = new Parser()

  greet('Eevee Repl v0.1')

  while (true) {
    const input = prompt('> ')

    if (!input || input.includes('exit')) {
      Deno.exit(1)
    }

    const program = parser.produceAst(input)
    console.log(program)
  }
}

repl()
