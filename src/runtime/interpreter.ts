import { MK_NUMBER, RuntimeVal } from './values.ts';
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  Program,
  Stmt,
  VarDeclaration,
} from '../frontend/ast.ts';
import Environment from './environment.ts';
import {
  eval_assignment_expr,
  eval_binary_expr,
  eval_identifier,
} from './eval/expressions.ts';
import { eval_program, eval_var_declaration } from './eval/statements.ts';
import { RuntimeError } from '../utils/error.ts';

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    // EXPRESSIONS
    case 'NumericLiteral':
      return MK_NUMBER((astNode as NumericLiteral).value);
    case 'Identifier':
      return eval_identifier(astNode as Identifier, env);
    case 'BinaryExpr':
      return eval_binary_expr(astNode as BinaryExpr, env);
    case 'AssignmentExpr':
      return eval_assignment_expr(astNode as AssignmentExpr, env);

    // STATEMENTS
    case 'Program':
      return eval_program(astNode as Program, env);
    case 'VarDeclaration':
      return eval_var_declaration(astNode as VarDeclaration, env);
    default:
      throw new RuntimeError(`Not implemented yet: ${astNode}`);
  }
}
