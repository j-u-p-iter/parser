import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class BinaryExprNode {
  constructor(public leftOperand: ExprNode, public operator: Token, public rightOperand: ExprNode) {};

  public type = "BinaryExpr";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitBinaryExprNode(this);
  }
}