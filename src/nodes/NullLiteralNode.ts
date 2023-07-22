import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class NullLiteralNode {
  constructor(public value: null) {};

  public type = "NullLiteral";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitNullLiteralNode(this);
  }
}