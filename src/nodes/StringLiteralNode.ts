import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class StringLiteralNode {
  constructor(public value: string) {};

  public type = "StringLiteral";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitStringLiteralNode(this);
  }
}