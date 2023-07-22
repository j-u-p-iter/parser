import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class ExpressionStatementNode {
  constructor(public expression: ExprNode) {};

  public type = "ExpressionStatement";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitExpressionStatementNode(this);
  }
}