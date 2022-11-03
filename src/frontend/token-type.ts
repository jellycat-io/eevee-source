export enum TokenType {
  // Single-character tokens.
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  SEMICOLON,
  QUESTION_MARK,
  COLUMN,

  // One or two character tokens.
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  PLUS,
  PLUS_EQUAL,
  PLUS_PLUS,
  MINUS,
  MINUS_EQUAL,
  MINUS_MINUS,
  STAR,
  STAR_EQUAL,
  SLASH,
  SLASH_EQUAL,
  PERCENT,
  PERCENT_EQUAL,

  // Literals.
  IDENTIFIER,
  STRING,
  NUMBER,

  BINARY_OP,

  // Keywords.
  AND,
  BREAK,
  CLASS,
  CONST,
  DEF,
  DO,
  ELSE,
  END,
  FOR,
  IF,
  LET,
  LAMBDA,
  MATCH,
  OR,
  PRINT,
  RETURN,
  SELF,
  SUPER,
  THEN,
  WHILE,

  // Misc.
  EOF,
}
