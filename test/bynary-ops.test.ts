import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import Environment from '../src/runtime/environment.ts';
import { NumberVal } from '../src/runtime/values.ts';
import { compileSource } from '../util/test-util.ts';

const env = new Environment();

Deno.test('addition', () => {
  const input = '3 + 2';
  assertEquals((compileSource(input, env) as NumberVal).value, 5);
});

Deno.test('substraction', () => {
  const input = '3 - 2';
  assertEquals((compileSource(input, env) as NumberVal).value, 1);
});

Deno.test('multiplication', () => {
  const input = '3 * 2';
  assertEquals((compileSource(input, env) as NumberVal).value, 6);
});

Deno.test('division', () => {
  const input = '11 / 2';
  assertEquals((compileSource(input, env) as NumberVal).value, 5.5);
});

Deno.test('modulo', () => {
  const input = '32 % 5';
  assertEquals((compileSource(input, env) as NumberVal).value, 2);
});

Deno.test('complex computation', () => {
  const input = '4 + ((6 * 5) - 9 % 2)';
  assertEquals((compileSource(input, env) as NumberVal).value, 33);
});

Deno.test('precedence', () => {
  const input = '4 - 9 * 2';
  assertEquals((compileSource(input, env) as NumberVal).value, -14);
});
