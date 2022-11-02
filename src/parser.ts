// deno-lint-ignore-file no-empty-interface
import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
} from './ast.ts'
import { Lexer, Token } from './lexer.ts'
import { TokenType } from './token-type.ts'

export interface ParseError extends Error {}

export class Parser {
  private tokens: Array<Token> = []

  public produceAst(sourceCode: string): Program {
    this.tokens = new Lexer(sourceCode).scan()

    const program: Program = {
      kind: 'Program',
      body: [],
    }

    while (this.not_eof()) {
      // Parse until end of file
      program.body.push(this.parse_stmt())
    }

    return program
  }

  private parse_stmt(): Stmt {
    // skip to parse_expr
    return this.parse_expr()
  }

  private parse_expr(): Expr {
    return this.parse_term_expr()
  }

  private parse_term_expr(): Expr {
    let expr = this.parse_factor_expr()

    while (
      this.at().type == TokenType.PLUS ||
      this.at().type == TokenType.MINUS
    ) {
      const operator = this.consume().literal
      const rhs = this.parse_factor_expr()
      expr = {
        kind: 'BinaryExpr',
        lhs: expr,
        rhs,
        operator,
      } as BinaryExpr
    }

    return expr
  }

  private parse_factor_expr(): Expr {
    let expr = this.parse_primary_expr()

    while (
      this.at().type == TokenType.STAR ||
      this.at().type == TokenType.SLASH ||
      this.at().type == TokenType.PERCENT
    ) {
      const operator = this.consume().literal
      const rhs = this.parse_primary_expr()
      expr = {
        kind: 'BinaryExpr',
        lhs: expr,
        rhs,
        operator,
      } as BinaryExpr
    }

    return expr
  }

  private parse_primary_expr(): Expr {
    const token = this.at().type

    switch (token) {
      case TokenType.IDENTIFIER:
        return {
          kind: 'Identifier',
          symbol: this.consume().literal,
        } as Identifier
      case TokenType.NUMBER:
        return {
          kind: 'NumericLiteral',
          value: parseFloat(this.consume().literal),
        } as NumericLiteral
      case TokenType.LEFT_PAREN: {
        this.consume() // Eat the opening paren
        const value = this.parse_expr()
        this.expect(TokenType.RIGHT_PAREN)
        return value
      }
      default:
        console.error('Unexpected token at', this.at())
        Deno.exit(1)
    }
  }

  private at(): Token {
    return this.tokens[0] as Token
  }

  private consume(): Token {
    const prev = this.tokens.shift() as Token
    return prev
  }

  private expect(type: TokenType) {
    const prev = this.tokens.shift() as Token
    if (!prev || prev.type !== type) {
      console.error(
        'Parse Error:\nUnexpected token at',
        prev,
        ' - Expected: ',
        type
      )
      Deno.exit(1)
    }

    return prev
  }

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF
  }
}
