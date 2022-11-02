import { Lexer } from './lexer.ts'

const source = await Deno.readTextFile('test.eve')
const lexer = new Lexer(source)
const tokens = lexer.scan()

for (const token of tokens) {
  console.log(token)
}
