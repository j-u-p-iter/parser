import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class UnaryExprNode {
  constructor(public operator: Token, public argument: ExprNode) {};

  public type = "UnaryExpr";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitUnaryExprNode(this);
  }
}