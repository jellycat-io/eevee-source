import { Token } from '../frontend/lexer.ts'

export class LexerError extends Error {
  private line: number
  private column: number

  constructor(line: number, column: number, message: string) {
    super(message)
    this.name = 'LexerError'
    this.line = line
    this.column = column
    Object.setPrototypeOf(this, LexerError.prototype)
  }

  getErrorMessage() {
    return `LexerError: (${this.line}:${this.column}) ${this.message}`
  }
}

export class ParseError extends Error {
  private token: Token

  constructor(token: Token, message: string) {
    super(message)
    this.name = 'ParseError'
    this.token = token
    Object.setPrototypeOf(this, ParseError.prototype)
  }

  getErrorMessage() {
    return `ParseError: (${this.token.line}:${this.token.column}) ${this.message}`
  }
}

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RuntimeError'
    Object.setPrototypeOf(this, RuntimeError.prototype)
  }

  getErrorMessage() {
    return `RuntimeError: ${this.message}`
  }
}
