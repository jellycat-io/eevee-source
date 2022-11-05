export type ValueType = 'nil' | 'number' | 'boolean' | 'object';

export interface RuntimeVal {
  type: ValueType;
}

export interface NullVal extends RuntimeVal {
  type: 'nil';
  value: null;
}

export interface NumberVal extends RuntimeVal {
  type: 'number';
  value: number;
}

export interface BooleanVal extends RuntimeVal {
  type: 'boolean';
  value: boolean;
}

export interface ObjectVal extends RuntimeVal {
  type: 'object';
  properties: Map<string, RuntimeVal>;
}

export function MK_NUMBER(n = 0) {
  return { type: 'number', value: n } as NumberVal;
}

export function MK_BOOL(b = true) {
  return { type: 'boolean', value: b } as BooleanVal;
}

export function MK_NULL() {
  return { type: 'nil', value: null } as NullVal;
}
