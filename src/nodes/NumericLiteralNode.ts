import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class NumericLiteralNode {
  constructor(public value: number) {};

  public type = "NumericLiteral";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitNumericLiteralNode(this);
  }
}