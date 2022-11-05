import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import { createGlobalEnv } from '../src/runtime/environment.ts';
import { NumberVal } from '../src/runtime/values.ts';
import { compileSource } from '../util/test-util.ts';

const env = createGlobalEnv();

Deno.test('increment number', () => {
  const input = '3++';
  assertEquals((compileSource(input, env) as NumberVal).value, 4);
});

Deno.test('decrement number', () => {
  const input = '3--';
  assertEquals((compileSource(input, env) as NumberVal).value, 2);
});

Deno.test('increment variable', () => {
  const input = 'let x = 5; x++';
  assertEquals((compileSource(input, env) as NumberVal).value, 6);
});

Deno.test('decrement variable', () => {
  const input = 'let y = 5; y--';
  assertEquals((compileSource(input, env) as NumberVal).value, 4);
});

Deno.test('increment boolean', () => {
  const input = 'true++';
  assertThrows(() => compileSource(input, env), Error);
});
