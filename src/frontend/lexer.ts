// -----------------------------------------------------------
// ---------------          LEXER          -------------------
// ---  Responsible for producing tokens from the source   ---
// -----------------------------------------------------------

import { TokenType } from './token-type.ts'
import { error } from '../utils/log.ts'
import { LexerError } from '../utils/error.ts'

export interface Token {
  type: TokenType
  literal: string
  line: number
  column: number
}

export const KEYWORDS: Record<string, TokenType> = {
  and: TokenType.AND,
  break: TokenType.BREAK,
  class: TokenType.CLASS,
  def: TokenType.DEF,
  do: TokenType.DO,
  else: TokenType.ELSE,
  end: TokenType.END,
  for: TokenType.FOR,
  if: TokenType.IF,
  lambda: TokenType.LAMBDA,
  let: TokenType.LET,
  const: TokenType.CONST,
  match: TokenType.MATCH,
  or: TokenType.OR,
  print: TokenType.PRINT,
  return: TokenType.RETURN,
  self: TokenType.SELF,
  super: TokenType.SUPER,
  then: TokenType.THEN,
  while: TokenType.WHILE,
}

export class Lexer {
  tokens: Array<Token> = []
  private readonly source: string
  private start = 0
  private current = 0
  private line = 1

  constructor(source: string) {
    this.source = source
  }

  scan(): Array<Token> {
    try {
      while (!this.isEOF()) {
        this.start = this.current
        this.tokenize()
      }

      this.addToken(TokenType.EOF, 'EndofFile')

      return this.tokens
    } catch (err) {
      if (err instanceof LexerError) error(err.getErrorMessage())
      error('Unexpected Lexer Eerror')
      Deno.exit(1)
    }
  }

  tokenize() {
    const c = this.advance()

    switch (c) {
      case ';':
        this.addToken(TokenType.SEMICOLON)
        break
      case '(':
        this.addToken(TokenType.LEFT_PAREN)
        break
      case ')':
        this.addToken(TokenType.RIGHT_PAREN)
        break
      case '+':
        this.addToken(TokenType.PLUS)
        break
      case '-':
        this.addToken(TokenType.MINUS)
        break
      case '*':
        this.addToken(TokenType.STAR)
        break
      case '/':
        this.addToken(TokenType.SLASH)
        break
      case '%':
        this.addToken(TokenType.PERCENT)
        break
      case '=':
        this.addToken(TokenType.EQUAL)
        break
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break
      case '\n':
        this.line++
        break
      case "'":
      case '"':
        this.string()
        break
      default:
        if (this.isDigit(c)) this.number()
        else if (this.isAlphaNumeric(c)) this.identifier()
        else {
          throw new LexerError(
            this.line,
            this.current,
            `Unexpected character at ${c}.`
          )
        }
        break
    }
  }

  private addToken(type: TokenType, literal?: string) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push({
      type,
      literal: literal ?? text,
      line: this.line,
      column: this.current,
    })
  }

  private number() {
    while (this.isDigit(this.peek())) {
      this.advance()
    }

    // Look for a decimal
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the '.'
      this.advance()

      while (this.isDigit(this.peek())) this.advance()
    }

    this.addToken(TokenType.NUMBER)
  }

  private string() {
    while (this.peek() !== "'" || (this.peek() !== '"' && !this.isEOF())) {
      if (this.peek() == '\n') this.line++
      this.advance()
    }

    if (this.isEOF()) {
      throw new LexerError(this.line, this.current, 'Unterminated string.')
    }

    // The closing "'
    this.advance()

    // Trim surronding quotes
    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, value)
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance()
    }

    const text = this.source.substring(this.start, this.current)
    const reserved = KEYWORDS[text]
    this.addToken(
      typeof reserved === 'number' ? reserved : TokenType.IDENTIFIER
    )
  }

  private advance() {
    return this.source.charAt(this.current++)
  }

  // private match(expected: string) {
  //   if (!this.isEOF()) return false
  //   if (this.source.charAt(this.current) !== expected) return false
  //
  //   this.current++
  //   return true
  // }

  private peek() {
    if (this.isEOF()) return '\0'
    return this.source.charAt(this.current)
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) {
      return '\0'
    }

    return this.source.charAt(this.current + 1)
  }

  private isEOF() {
    return this.current >= this.source.length
  }

  private isAlpha(src: string) {
    return /[a-zA-Z_]+/.test(src)
  }

  private isDigit(src: string) {
    return /[0-9]+/.test(src)
  }

  private isAlphaNumeric(src: string) {
    return this.isAlpha(src) || this.isDigit(src)
  }
}
