import {
  AssignmentExpr,
  BinaryExpr,
  Expr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  PostfixExpr,
  Program,
  Property,
  Stmt,
  VarDeclaration,
} from './ast.ts';
import { Lexer, Token } from './lexer.ts';
import { TokenType } from './token-type.ts';
import { ParseError } from '../utils/error.ts';
import { error } from '../utils/log.ts';

export class Parser {
  private tokens: Array<Token> = [];

  public produceAst(sourceCode: string): Program {
    this.tokens = new Lexer(sourceCode).scan();
    try {
      const program: Program = {
        kind: 'Program',
        body: [],
      };

      while (this.not_eof()) {
        // Parse until end of file
        program.body.push(this.parse_stmt());
      }

      return program;
    } catch (err) {
      if (err instanceof ParseError) error(err.getErrorMessage());
      else error('Unexpected Parse Error');
      Deno.exit(1);
    }
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.LET:
      case TokenType.CONST:
        return this.parse_var_declaration();
      default:
        return this.parse_expr();
    }
  }

  private parse_var_declaration(): Stmt {
    const isConstant = this.consume().type == TokenType.CONST;
    const identifier = this.expect(
      TokenType.IDENTIFIER,
      'Expected identifier after variable declaration.',
    ).literal;

    if (this.match(TokenType.SEMICOLON)) {
      if (isConstant) {
        throw new ParseError(
          this.at(),
          'Must assign value to constant expression.',
        );
      }

      return {
        kind: 'VarDeclaration',
        identifier,
        constant: false,
        value: null,
      } as VarDeclaration;
    }

    this.expect(TokenType.EQUAL, 'Expected \'=\' after identifier.');

    const declaration = {
      kind: 'VarDeclaration',
      identifier,
      value: this.parse_expr(),
      constant: isConstant,
    } as VarDeclaration;

    this.expect(TokenType.SEMICOLON, 'Missing semicolon.');
    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const expr = this.parse_object_expr();

    if (this.match(TokenType.EQUAL)) {
      const value = this.parse_assignment_expr();
      this.expect(TokenType.SEMICOLON, 'Missing semicolon.');
      return {
        kind: 'AssignmentExpr',
        assignee: expr,
        value,
      } as AssignmentExpr;
    }

    return expr;
  }

  private parse_object_expr(): Expr {
    if (this.match(TokenType.LEFT_BRACKET)) {
      const properties = new Array<Property>();

      while (this.not_eof() && !this.check(TokenType.RIGHT_BRACKET)) {
        // { key: val, key: val }
        const key =
          this.expect(TokenType.IDENTIFIER, 'Identifier expected.').literal;

        // Allows shorthand key: pair -> key
        if (this.match(TokenType.COMMA)) {
          properties.push({ kind: 'Property', key });
          continue;
        } else if (this.check(TokenType.RIGHT_BRACKET)) {
          properties.push({ kind: 'Property', key });
          continue;
        }

        this.expect(TokenType.COLUMN, 'Missing \':\' after identifier.');
        const value = this.parse_expr();

        properties.push({ kind: 'Property', key, value });
        if (!this.check(TokenType.RIGHT_BRACKET)) {
          this.expect(TokenType.COMMA, 'Missing \',\' after key: value pair.');
        }
      }

      this.expect(
        TokenType.RIGHT_BRACKET,
        'Missing \'}\' after object literal.',
      );
      return { kind: 'ObjectLiteral', properties } as ObjectLiteral;
    }

    return this.parse_term_expr();
  }

  private parse_term_expr(): Expr {
    let expr = this.parse_factor_expr();

    while (
      this.check(TokenType.PLUS) ||
      this.check(TokenType.MINUS) ||
      this.check(TokenType.PLUS_EQUAL) ||
      this.check(TokenType.MINUS_EQUAL)
    ) {
      const operator = this.consume().literal;
      const rhs = this.parse_factor_expr();
      expr = {
        kind: 'BinaryExpr',
        lhs: expr,
        rhs,
        operator,
      } as BinaryExpr;
    }
    return expr;
  }

  private parse_factor_expr(): Expr {
    let expr = this.parse_postfix_expr();

    while (
      this.check(TokenType.STAR) ||
      this.check(TokenType.SLASH) ||
      this.check(TokenType.PERCENT)
    ) {
      const operator = this.consume().literal;
      const rhs = this.parse_postfix_expr();
      expr = {
        kind: 'BinaryExpr',
        lhs: expr,
        rhs,
        operator,
      } as BinaryExpr;
    }

    return expr;
  }

  private parse_postfix_expr(): Expr {
    let expr = this.parse_primary_expr();
    if (this.check(TokenType.PLUS_PLUS) || this.check(TokenType.MINUS_MINUS)) {
      const operator = this.consume().literal;
      expr = { kind: 'PostfixExpr', operator, lhs: expr } as PostfixExpr;
    }

    return expr;
  }

  private parse_primary_expr(): Expr {
    const token = this.at().type;

    switch (token) {
      case TokenType.IDENTIFIER:
        return {
          kind: 'Identifier',
          symbol: this.consume().literal,
        } as Identifier;
      case TokenType.NUMBER:
        return {
          kind: 'NumericLiteral',
          value: parseFloat(this.consume().literal),
        } as NumericLiteral;
      case TokenType.LEFT_PAREN: {
        this.consume(); // Eat the opening paren
        const value = this.parse_expr();
        this.expect(TokenType.RIGHT_PAREN, 'Expected \')\' after expression.');
        return value;
      }
      default:
        throw new ParseError(
          this.at(),
          `Unexpected token at ${this.at().literal}`,
        );
    }
  }

  private at(): Token {
    return this.tokens[0] as Token;
  }

  private consume(): Token {
    return this.tokens.shift() as Token;
  }

  private check(type: TokenType): boolean {
    if (!this.not_eof()) return false;
    return this.at().type == type;
  }

  private match(...types: Array<TokenType>): boolean {
    for (let i = 0; i < types.length; i++) {
      if (this.check(types[i])) {
        this.consume();
        return true;
      }
    }
    return false;
  }

  private expect(type: TokenType, message: string) {
    const prev = this.consume();
    if (!prev || prev.type !== type) {
      throw new ParseError(prev, message);
    }

    return prev;
  }

  private not_eof(): boolean {
    return this.at().type != TokenType.EOF;
  }
}
