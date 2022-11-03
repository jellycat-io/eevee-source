// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export type NodeType =
  // STATEMENTS
  | 'Program'
  | 'VarDeclaration'
  // EXPRESSIONS
  | 'NumericLiteral'
  | 'Identifier'
  | 'StringLiteral'
  | 'BooleanLiteral'
  | 'UnaryExpr'
  | 'PostfixExpr'
  | 'BinaryExpr'
  | 'FunctionDecl';

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: 'Program';
  body: Array<Stmt>;
}

export interface VarDeclaration extends Stmt {
  kind: 'VarDeclaration';
  constant: boolean;
  identifier: string;
  value: Expr | null;
}

// deno-lint-ignore no-empty-interface
export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: 'BinaryExpr';
  operator: string;
  lhs: Expr;
  rhs: Expr;
}

export interface Identifier extends Expr {
  kind: 'Identifier';
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: 'NumericLiteral';
  value: number;
}

export interface StringLiteral extends Expr {
  kind: 'StringLiteral';
  value: string;
}

export interface BooleanLiteral extends Expr {
  kind: 'BooleanLiteral';
  value: boolean;
}
