// -----------------------------------------------------------
// --------------          AST TYPES        ------------------
// ---     Defines the structure of our languages AST      ---
// -----------------------------------------------------------

export type NodeType =
  // STATEMENTS
  | 'Program'
  | 'VarDeclaration'
  // EXPRESSIONS
  | 'AssignmentExpr'
  | 'UnaryExpr'
  | 'PostfixExpr'
  | 'BinaryExpr'
  | 'FunctionDecl'
  // LITERALS
  | 'Property'
  | 'ObjectLiteral'
  | 'NumericLiteral'
  | 'Identifier'
  | 'StringLiteral'
  | 'BooleanLiteral';

/*
 * STATEMENTS
 */

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

/*
 * EXPRESSIONS
 */

// deno-lint-ignore no-empty-interface
export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
  kind: 'AssignmentExpr';
  assignee: Expr;
  value: Expr;
}

export interface PostfixExpr extends Expr {
  kind: 'PostfixExpr';
  operator: string;
  lhs: Expr;
}

export interface BinaryExpr extends Expr {
  kind: 'BinaryExpr';
  operator: string;
  lhs: Expr;
  rhs: Expr;
}

/*
 * LITERALS
 */

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

export interface Property extends Expr {
  kind: 'Property';
  key: string;
  value?: Expr;
}

export interface ObjectLiteral extends Expr {
  kind: 'ObjectLiteral';
  properties: Array<Property>;
}
