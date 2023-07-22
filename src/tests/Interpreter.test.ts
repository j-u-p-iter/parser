import { Interpreter } from '../services/Interpreter';
import { NumericLiteralNode } from '../nodes/NumericLiteralNode';
import { StringLiteralNode } from '../nodes/StringLiteralNode';
import { BooleanLiteralNode } from '../nodes/BooleanLiteralNode';
import { NullLiteralNode } from '../nodes/NullLiteralNode';
import { UnaryExprNode } from '../nodes/UnaryExprNode';
import { Token } from '../Token';
import { TokenType } from '../types';

describe('Interpreter', () => {
  let interpreter: Interpreter;

  beforeAll(() => {
    interpreter = new Interpreter();
  });

  describe('for numeric literals', () => {
    it('evaluates properly', () => {
      const numericLiteral = new NumericLiteralNode(5);

      expect(interpreter.evaluate(numericLiteral)).toBe(5);
    });
  });

  describe('for string literals', () => {
    it('evaluates properly', () => {
      const stringLiteral = new StringLiteralNode('value');

      expect(interpreter.evaluate(stringLiteral)).toBe('value');
    });
  });

  describe('for boolean literals', () => {
    it('evaluates properly', () => {
      const booleanLiteral = new BooleanLiteralNode(true);

      expect(interpreter.evaluate(booleanLiteral)).toBe(true);
    });
  });

  describe('for null literals', () => {
    it('evaluates properly', () => {
      const nullLiteral = new NullLiteralNode(null);

      expect(interpreter.evaluate(nullLiteral)).toBe(null);
    });
  });

  describe('for unary expressions', () => {
    it('evaluates properly', () => {
      const minusToken = new Token(TokenType.AdditiveOperator, '-', 1);
      const numericLiteral = new NumericLiteralNode(5);

      const unaryExpr = new UnaryExprNode(minusToken, numericLiteral);

      expect(interpreter.evaluate(unaryExpr)).toBe(-5);
    });
  });
});
