import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class BooleanLiteralNode {
  constructor(public value: boolean) {};

  public type = "BooleanLiteral";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitBooleanLiteralNode(this);
  }
}