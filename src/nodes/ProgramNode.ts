import { ExprNodeVisitor } from './ExprNodeVisitor';    
import { Token } from '../Token';
import { ExprNode } from './ExprNode';

export class ProgramNode {
  constructor(public body: ExprNode[]) {};

  public type = "Program";

  public accept(visitor: ExprNodeVisitor) {
    return visitor.visitProgramNode(this);
  }
}