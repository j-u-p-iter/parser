/**
 * Letter parser: recursive descent implementation.
 *
 */

const { Tokenizer } = require('./Tokenizer');

/**
 *
 * About the parser.
 *
 * parse - is the main method. It parses string, recursively starting from the starting symbol.
 *
 * The starting symbol in our case is called the Program.
 *
 * Each production rule has representation in form of class method. E.g. if the grammar of our language
 *   looks like that:
 *   
 *   Program        => NumericLiteral;
 *   NumericLiteral => NUMBER;
 *
 *   then our Parser will contain two respective methods for the two productions, mentioned in the grammar:
 *     - Program
 *     - NumericLiteral.
 *
 *   The methods are called the same way they are called in the grammar.
 *
 *   Parser returns AST tree. As result, each production of the grammar will be represented by the AST tree node.
 *
 *   Each AST tree node has a type. So, each method, related to the respective production rule in the grammar will
 *   return AST tree node. Each AST tree node has the base structure in form of object with two main properties - type and value.
 *   Tree node can have more properties than just these two. But these two are mandatory and other options are optional.
 *
 *   The program described by the grammar provided above has the the next AST structure (for the numeric literal equals to 5):
 *
 *   {
 *     type: 'Program',
 *     body: {
 *       type: 'NumericLiteral',
 *       value: 5,
 *     }, 
 *   };
 */

class Parser {
  constructor() {
    this._string = '';
    this._tokenizer = new Tokenizer();
  }

  /**
   * Parse a string inti an AST
   *
   */
  parse(string) {
    this._string = string;

    this._tokenizer.init(this._string);

    this._lookahead = this._tokenizer.getNextToken();

    /**
     * Parsing, recursively starting from the main entry point,
     *   the Program.
     */
    return this.Program();
  }

  /**
   * Main entry point.
   *
   * Program             => StatementsList;
   * StatementsList      => Statement | StatementsList Statement;
   * Statement           => ExpressionStatement | BlockStatement | EmptyStatement;
   * BlockStatement      => "{" StatementList | ɛ "}";
   * ExpressionStatement => MultiplicationExpression;
   * MultiplicationExpression => AdditiveExpression "| AdditiveExpressin (+ | -) AdditiveExpression;";
   * AdditiveExpression => Literal | Literal (+|-) Literal;
   * Literal             => NumericLiteral | StringLiteral;
   * NumericLiteral      => NUMBER;
   * StringLiteral       => STRING;
   *
   */
  Program() {
    return {
      type: 'Program', 
      body: this.StatementList(),
    };
  }


  StatementList() {
    let statementList = [];

    const nextToken = this._peek(); 

    while(this._peek() !== null && this._peek().type !== '}') {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch(this._peek().type) {
      case ';':
        return this.EmptyStatement();

      case '{':
        return this.BlockStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  EmptyStatement() {
    return { type: "EmptyStatement" };
  }

  BlockStatement() {
    this._eat('{');

    const statementList = this.StatementList();

    this._eat('}');

    return {
      type: 'BlockStatement',
      body: statementList,
    }  
  }

  EqualityExpression() {
    let leftOperand = this.ComparisonExpression();

    while (this._check('EQUALITY_OPERATOR')) {
      const operator = this._eat('EQUALITY_OPERATOR');

      const rightOperand = this.ComparisonExpression();

      leftOperand = this.BinaryExpression(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  ComparisonExpression() {
    let leftOperand = this.AdditiveExpression();

    while (this._check('COMPARISON_OPERATOR')) {
      const operator = this._eat('COMPARISON_OPERATOR');

      const rightOperand = this.AdditiveExpression();

      leftOperand = this.BinaryExpression(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  AdditiveExpression() {
    let leftOperand = this.MultiplicativeExpression();

    while (this._check('ADDITIVE_OPERATOR')) {
      const operator = this._eat('ADDITIVE_OPERATOR');

      const rightOperand = this.MultiplicativeExpression();

      leftOperand = this.BinaryExpression(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  MultiplicativeExpression() {
    let leftOperand = this.Literal();

    while(this._check('MULTIPLICATIVE_OPERATOR')) {
      const operator = this._eat('MULTIPLICATIVE_OPERATOR');

      const rightOperand = this.Literal();

      leftOperand = this.BinaryExpression(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  };

  ExpressionStatement() {
    const expressionStatement = {
      type: "ExpressionStatement",
      expression: this.EqualityExpression(),
    };

    /**
     * We don't need the ";" token, so we just emit it,
     *   instead of keeping it in the variable.
     *
     */
    this._eat(';');

    return expressionStatement;
  }
  
  /**
   * 2 + 3 + 4 + 5
   *
   * The precedence of the operator the higher,
   *   the higher it's to the left side of the expression.
   *
   * As we know in the AST the precedence is 
   *   presented by the nesting level. The deeper the BinaryExpression
   *   into the tree, the higher precedence of it's operator.
   *
   * So, in case of the 2 + 3 + 4 the left operand of the root BinaryExpression will contain BinaryExpression
   * 2 + 3, which has the highest precedence. The root BinaryExpression will contain 5 + 4. (5 is the evaluated left operand). 
   *
   * In case of the 2 + 3 + 4 + 5. We have three operands, so we'll have 3 level of nesting of BinaryExpression. The deepest one
   * will be located in the left operand of the parent BinaryExpresion and it's 2 + 3.
   *
   * The second nested level will contain BinaryExpression with 5 + 4 (5 is the describe above left operand).
   *
   * The root (closest to the top) BinaryExpression will contain 9 + 5 (9 is the described above left operand).
   */

  BinaryExpression(leftOperand, operator, rightOperand) {
    return {
      type: "BinaryExpression",
      operator,
      left: leftOperand,
      right: rightOperand, 
    };
  }

  Literal() {
    switch(this._peek().type) {
      case 'NUMBER':
        return this.NumericLiteral();

      case 'STRING':
        return this.StringLiteral();
    }

    throw new SyntaxError('Literal: unexpected literal production.');
  }

  /**
   * NumericLiteral => NUMBER;
   *
   */
  NumericLiteral() {
    const token = this._eat('NUMBER');

    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    };
  }

  /**
   * StringLiteral => STRING;
   *
   */
  StringLiteral() {
    const token = this._eat('STRING');

    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1),
    };
  }

  _check(type) {
    if(this._isEOF()) {
      return false;
    }

    return this._peek().type === type;
  }

  _isEOF() {
    return this._tokenizer.isEOF();
  }

  /**
   * Looking ahead the next token.
   */
  _peek() {
    return this._lookahead;
  }

  /**
   * Validates current token before
   *   returning it from the parser.
   */
  _eat(tokenType) {
    const nextToken = this._peek(); 

    if (nextToken == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected ${tokenType}`
      );
    }

    if (nextToken.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: ${nextToken.type}, expected ${tokenType}`
      );
    }

    /**
     * All checks have been done.
     *   Advance to next token and return it.
     */

    this._lookahead = this._tokenizer.getNextToken();
    
    return nextToken;
  }
}

module.exports = {
  Parser,
}
