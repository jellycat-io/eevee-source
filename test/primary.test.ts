import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts'
import Environment from '../src/runtime/environment.ts'
import { NumberVal } from '../src/runtime/values.ts'
import { compileSource } from '../util/test-util.ts'

const env = new Environment()

Deno.test('number', () => {
  const input = '3'
  assertEquals((compileSource(input, env) as NumberVal).value, 3)
})
