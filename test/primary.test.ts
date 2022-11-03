import { assertEquals } from 'https://deno.land/std@0.161.0/testing/asserts.ts';
import Environment from '../src/runtime/environment.ts';
import {
  BooleanVal,
  MK_BOOL,
  MK_NULL,
  NumberVal,
} from '../src/runtime/values.ts';
import { compileSource } from '../util/test-util.ts';

const env = new Environment();
env.declareVar('true', MK_BOOL(true), true);
env.declareVar('false', MK_BOOL(false), true);
env.declareVar('nil', MK_NULL(), true);

Deno.test('number', () => {
  const input = '3';
  assertEquals((compileSource(input, env) as NumberVal).value, 3);
});

Deno.test('true', () => {
  const input = 'true';
  assertEquals((compileSource(input, env) as BooleanVal).value, true);
});

Deno.test('false', () => {
  const input = 'false';
  assertEquals((compileSource(input, env) as BooleanVal).value, false);
});

Deno.test('nil', () => {
  const input = 'nil';
  assertEquals((compileSource(input, env) as BooleanVal).value, null);
});
