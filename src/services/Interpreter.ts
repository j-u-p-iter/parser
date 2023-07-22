import { ExprNodeVisitor } from '../nodes/ExprNodeVisitor';

import { BinaryExprNode } from '../nodes/BinaryExprNode';
import { UnaryExprNode } from '../nodes/UnaryExprNode';
import { LogicalExprNode } from '../nodes/LogicalExprNode';
import { NumericLiteralNode } from '../nodes/NumericLiteralNode';
import { StringLiteralNode } from '../nodes/StringLiteralNode';
import { BooleanLiteralNode } from '../nodes/BooleanLiteralNode';
import { NullLiteralNode } from '../nodes/NullLiteralNode';
import { ProgramNode } from '../nodes/ProgramNode';
import { ExpressionStatementNode } from '../nodes/ExpressionStatementNode';

import { ExprNode } from '../nodes/ExprNode';

export class Interpreter implements ExprNodeVisitor {
  public evaluate(expression: ExprNode) {
    return expression.accept(this);
  }

  public visitNumericLiteralNode(exprNode: NumericLiteralNode) {
    return exprNode.value;  
  }

  public visitProgramNode(exprNode: ProgramNode) {
    return 'Program Node';
  }

  public visitExpressionStatementNode(exprNode: ExpressionStatementNode) {
    return 'Expr Statement';
  }

  public visitUnaryExprNode(exprNode: UnaryExprNode) {
    const argument = this.evaluate(exprNode.argument);

    switch(exprNode.operator.lexeme) {
      case '-':
        return -this.evaluate(exprNode.argument);
    }
  }

  public visitBinaryExprNode(exprNode: BinaryExprNode) {
    return 'Binary Expr';
  }

  public visitLogicalExprNode(exprNode: LogicalExprNode) {
    return 'Logical Expr';
  };

  public visitStringLiteralNode(exprNode: StringLiteralNode) { 
    return exprNode.value;
  };

  public visitBooleanLiteralNode(exprNode: BooleanLiteralNode) { 
    return exprNode.value;
  };

  public visitNullLiteralNode(exprNode: NullLiteralNode) { 
    return exprNode.value;
  };
}
