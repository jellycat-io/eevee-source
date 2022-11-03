export type ValueType = 'nil' | 'number'

export interface RuntimeVal {
  type: ValueType
}

export interface NullVal extends RuntimeVal {
  type: 'nil'
  value: 'nil'
}

export interface NumberVal extends RuntimeVal {
  type: 'number'
  value: number
}
