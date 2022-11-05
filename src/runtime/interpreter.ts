import { MK_NUMBER, RuntimeVal } from './values.ts';
import {
  AssignmentExpr,
  BinaryExpr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  PostfixExpr,
  Program,
  Stmt,
  VarDeclaration,
} from '../frontend/ast.ts';
import Environment from './environment.ts';
import {
  eval_assignment_expr,
  eval_binary_expr,
  eval_identifier,
  eval_object_expr,
  eval_postfix_expr,
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
    case 'PostfixExpr':
      return eval_postfix_expr(astNode as PostfixExpr, env);
    case 'ObjectLiteral':
      return eval_object_expr(astNode as ObjectLiteral, env);

    // STATEMENTS
    case 'Program':
      return eval_program(astNode as Program, env);
    case 'VarDeclaration':
      return eval_var_declaration(astNode as VarDeclaration, env);
    default:
      throw new RuntimeError(`Not implemented yet: ${JSON.stringify(astNode)}`);
  }
}
