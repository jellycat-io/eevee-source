import { Parser } from './src/frontend/parser.ts'
import Environment from './src/runtime/environment.ts'
import { evaluate } from './src/runtime/interpreter.ts'
import { greet } from './src/utils/log.ts'

async function run(filename: string) {
  const parser = new Parser()
  const env = new Environment()

  const input = await Deno.readTextFile(filename)
  const program = parser.produceAst(input)
  const res = evaluate(program, env)
  console.log(res)
}

function repl() {
  const parser = new Parser()
  const env = new Environment()

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

run('test.eve')
