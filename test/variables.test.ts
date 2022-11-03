import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import Environment from '../src/runtime/environment.ts';
import { NullVal, NumberVal } from '../src/runtime/values.ts';
import { compileSource } from '../util/test-util.ts';

const env = new Environment();

Deno.test('let declaration without assignment', () => {
  const input = 'let foo;';
  assertEquals((compileSource(input, env) as NullVal).value, null);
});

Deno.test('let declaration with assignment', () => {
  const input = 'let x = 2;';
  assertEquals((compileSource(input, env) as NumberVal).value, 2);
});

Deno.test('const declaration with assignment', () => {
  const input = 'const MARIGNAN = 1515;';
  assertEquals((compileSource(input, env) as NumberVal).value, 1515);
});

Deno.test('const declaration without assignment', () => {
  const input = 'const bar;';
  assertThrows(() => compileSource(input, env), Error);
});

Deno.test('const assignment', () => {
  const input = `
    const y = 2;
    y = 5;
  `;
  assertThrows(() => compileSource(input, env), Error);
});

Deno.test('let assignment', () => {
  const env = new Environment();
  const input = `
    let z = 2;
    z = 5;
  `;
  assertEquals((compileSource(input, env) as NumberVal).value, 5);
});

Deno.test('let assignment with another variable', () => {
  const env = new Environment();
  const input = `
    let a = 2;
    let b = 3;
    a = b;
  `;
  assertEquals((compileSource(input, env) as NumberVal).value, 3);
});
