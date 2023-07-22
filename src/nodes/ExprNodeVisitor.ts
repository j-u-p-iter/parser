import { ProgramNode } from './ProgramNode';
import { ExpressionStatementNode } from './ExpressionStatementNode';
import { BinaryExprNode } from './BinaryExprNode';
import { UnaryExprNode } from './UnaryExprNode';
import { LogicalExprNode } from './LogicalExprNode';
import { NumericLiteralNode } from './NumericLiteralNode';
import { StringLiteralNode } from './StringLiteralNode';
import { BooleanLiteralNode } from './BooleanLiteralNode';
import { NullLiteralNode } from './NullLiteralNode';

export abstract class ExprNodeVisitor<T = any> {
  visitProgramNode(exprNode: ProgramNode): T | undefined { return; };

  visitExpressionStatementNode(exprNode: ExpressionStatementNode): T | undefined { return; };

  visitBinaryExprNode(exprNode: BinaryExprNode): T | undefined { return; };

  visitUnaryExprNode(exprNode: UnaryExprNode): T | undefined { return; };

  visitLogicalExprNode(exprNode: LogicalExprNode): T | undefined { return; };

  visitNumericLiteralNode(exprNode: NumericLiteralNode): T | undefined { return; };

  visitStringLiteralNode(exprNode: StringLiteralNode): T | undefined { return; };

  visitBooleanLiteralNode(exprNode: BooleanLiteralNode): T | undefined { return; };

  visitNullLiteralNode(exprNode: NullLiteralNode): T | undefined { return; };
}