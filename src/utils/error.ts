export class LexerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LexerError'
    Object.setPrototypeOf(this, LexerError.prototype)
  }

  getErrorMessage() {
    return `Lexer Error: ${this.message}`
  }
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
    Object.setPrototypeOf(this, ParseError.prototype)
  }

  getErrorMessage() {
    return `Parse Error: ${this.message}`
  }
}

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RuntimeError'
    Object.setPrototypeOf(this, RuntimeError.prototype)
  }

  getErrorMessage() {
    return `Runtime Error: ${this.message}`
  }
}
