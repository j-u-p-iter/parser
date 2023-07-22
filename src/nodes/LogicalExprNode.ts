import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class LogicalExprNode {
  constructor(public left: ExprNode, public operator: Token, public right: ExprNode) {};

  public type = "LogicalExpr";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitLogicalExprNode(this);
  }
}