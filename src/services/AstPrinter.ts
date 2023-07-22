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

export class AstPrinter implements ExprNodeVisitor {
  private group(name: string, ...expressions: ExprNode[]): string {
    let groupValue = `(${name}`; 

    expressions.forEach((expr) => {
      groupValue = `${groupValue} ${expr.accept(this)}` 
    });

    groupValue = `${groupValue})`;

    return groupValue;
  }

  public print(expression: ExprNode) {
    return expression.accept(this); 
  }

  public visitProgramNode(exprNode: ProgramNode) {
    return this.group(
      exprNode.type,
      ...exprNode.body,
    );
  }

  public visitExpressionStatementNode(exprNode: ExpressionStatementNode) {
    return exprNode.expression.accept(this);
  }

  public visitUnaryExprNode(exprNode: UnaryExprNode) {
    return this.group(
      exprNode.operator.lexeme, 
      exprNode.argument
    );
  }

  public visitBinaryExprNode(exprNode: BinaryExprNode) {
    return this.group(
      exprNode.operator.lexeme, 
      exprNode.leftOperand, 
      exprNode.rightOperand
    );
  }

  public visitLogicalExprNode(exprNode: LogicalExprNode) { 
    return this.group(
      exprNode.operator.lexeme, 
      exprNode.left, 
      exprNode.right
    );
  };

  public visitNumericLiteralNode(exprNode: NumericLiteralNode) { 
    return exprNode.value;
  };

  public visitStringLiteralNode(exprNode: StringLiteralNode) { 
    return exprNode.value;
  };

  public visitBooleanLiteralNode(exprNode: BooleanLiteralNode) { 
    return `${exprNode.value}`;
  };

  public visitNullLiteralNode(exprNode: NullLiteralNode) { 
    return 'null';
  };
};
