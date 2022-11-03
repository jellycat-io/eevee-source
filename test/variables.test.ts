import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import Environment from '../src/runtime/environment.ts';
import { NullVal, NumberVal } from '../src/runtime/values.ts';
import { compileSource } from '../util/test-util.ts';

Deno.test('let declaration without assignment', () => {
  const env = new Environment();
  const input = 'let x;';
  assertEquals((compileSource(input, env) as NullVal).value, null);
});

Deno.test('let declaration with assignment', () => {
  const env = new Environment();
  const input = 'let x = 2;';
  assertEquals((compileSource(input, env) as NumberVal).value, 2);
});

Deno.test('const declaration with assignment', () => {
  const env = new Environment();
  const input = 'const PI = 3.14;';
  assertEquals((compileSource(input, env) as NumberVal).value, 3.14);
});

Deno.test('const declaration without assignment', () => {
  const env = new Environment();
  const input = 'const x;';
  assertThrows(() => compileSource(input, env), Error);
});
