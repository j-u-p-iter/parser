import { ProgramNode } from './ProgramNode';
import { ExpressionStatementNode } from './ExpressionStatementNode';
import { BinaryExprNode } from './BinaryExprNode';
import { UnaryExprNode } from './UnaryExprNode';
import { LogicalExprNode } from './LogicalExprNode';
import { NumericLiteralNode } from './NumericLiteralNode';
import { StringLiteralNode } from './StringLiteralNode';
import { BooleanLiteralNode } from './BooleanLiteralNode';
import { NullLiteralNode } from './NullLiteralNode';

export type ExprNode = ProgramNode | ExpressionStatementNode | BinaryExprNode | UnaryExprNode | LogicalExprNode | NumericLiteralNode | StringLiteralNode | BooleanLiteralNode | NullLiteralNode;
