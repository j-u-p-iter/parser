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
 *   The methods are called the same way respective non-terminals are called in the grammar.
 *
 *   Parser returns AST tree. As result, each production of the grammar will be represented by the AST tree node.
 *
 *   Each AST tree node has a type. So, each method, related to the respective production rule in the grammar will
 *   return AST tree node. Each AST tree node has the base structure in form of object with two 
 *   main properties - type and value. Tree node can have more properties than just these two. 
 *   But these two are mandatory and other options are optional.
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
   * AdditiveExpression => Literal | Literal (+|-) Literal;
   * MultiplicationExpression => AdditiveExpression "| AdditiveExpressin (+ | -) AdditiveExpression;";
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

    while(this._peek() !== null && !this._check('}')) {
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

      case 'IF':
        return this.IfStatement();

      case 'WHILE':
        return this.WhileStatement();

      case 'DO':
        return this.DoWhileStatement();

      case "FOR":
        return this.ForStatement();

      case "let":
        return this.VariableDeclaration();

      case "FUNCTION":
        return this.FunctionDeclaration();

      case "RETURN":
        return this.ReturnStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  ReturnStatement() {
    this._eat('RETURN');

    const argument = !this._check(';') ? this.Expression() : null;  

    this._eat(';');

    return {
      type: "ReturnStatement",
      argument,
    };
  }

  /**
   * IfStatement => "if" "(" Expression ")" Statement ("else" Statement)?
   *
   */
  IfStatement() {
    this._eat('IF');

    this._eat('LEFT_PAREN');

    const test = this.Expression(); 

    this._eat('RIGHT_PAREN');

    const consequent = this.Statement(); 

    let alternate = null;

    if (this._match('ELSE')) {
      alternate = this.Statement(); 
    }

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    };
  }

  ForStatement() {
    this._eat('FOR');

    this._eat('LEFT_PAREN');

    const init = this._check('let') 
      ? this.VariableDeclarationInit() 
      : !this._check(';') ? this.Expression() : null; 

    this._eat(';');

    const test = !this._check(';') ? this.Expression() : null;

    this._eat(';')

    const update = !this._check('RIGHT_PAREN') ? this.Expression() : null;

    this._eat('RIGHT_PAREN');

    const body = this.Statement();
    
    return {
      type: "ForStatement",
      init,
      test,
      update,
      body,
    };
  }

  /**
   * WhileStatemen => 
   *   "while" "(" Expression ")" Statement;
   *
   */
  WhileStatement() {
    this._eat('WHILE');

    this._eat('LEFT_PAREN');

    const test = this.Expression();

    this._eat('RIGHT_PAREN');

    const body = this.Statement();

    return {
      type: "WhileStatement",
      test,
      body,
    };
  }

  /**
   * DoWhileStatement => 
   *   "do" Statement "while" "(" Expression ")" ";";
   *
   */
  DoWhileStatement() {
    this._eat("DO");

    const body = this.Statement();

    this._eat("WHILE");

    this._eat("LEFT_PAREN");

    const test = this.Expression();

    this._eat("RIGHT_PAREN");

    this._eat(";");

    return {
      type: "DoWhileStatement",
      body,
      test,
    }
  }

  VariableDeclarationInit() {
    this._eat('let');

    const variableDeclarationsList = this.VariableDeclarationsList();

    return {
      type: "VariableDeclaration",
      declarations: variableDeclarationsList,
    };
  }

  VariableDeclaration() {
    const variableDeclaration = this.VariableDeclarationInit();

    this._eat(';');

    return variableDeclaration;
  }

  VariableDeclarationsList() {
    const variableDeclarationsList = [this.VariableDeclarator()];

    

    while(this._match('COMMA')) {
      variableDeclarationsList.push(this.VariableDeclarator());
    }

    return variableDeclarationsList;
  }

  VariableDeclarator() {
    const identifier = this.Identifier();

    let initializer = null;

    if (this._check('SIMPLE_ASSIGNMENT_OPERATOR')) {
      this._eat('SIMPLE_ASSIGNMENT_OPERATOR');

      initializer = this.Expression();
    }

    return {
      type: "VariableDeclarator",
      id: identifier,
      init: initializer, 
    };
  }

  EmptyStatement() {
    return { type: "EmptyStatement" };
  }

  /**
   * BlockStatement => "{" StatementList "}";
   *
   */
  BlockStatement() {
    this._eat('{');

    const statementList = this.StatementList();

    this._eat('}');

    return {
      type: 'BlockStatement',
      body: statementList,
    }  
  }

  Expression() {
    return this.AssignmentExpression();
  }

  /**
   * If we have ASSIGNMENT_OPERATOR:
   * - we expect the IDENTIFIER (variable) in front of the ASSIGNMENT_OPERATOR
   * - the expression after the ASSIGNMENT_OPERATOR 
   *
   * If there is not ASSIGNMENT_OPERATOR we expect to have one of the further 
   *   expressions, starting from the EqualityExpression
   *
   * AssignmentExpression => IDENTIFIER ASSIGNMENT_OPERATOR AssignmentExpression | LogicalORExpression
   */
  AssignmentExpression() {
    const expression = this.LogicalOrExpression();

    const assignmentOperator = this._match(
      'SIMPLE_ASSIGNMENT_OPERATOR', 
      'COMPLEX_ASSIGNMENT_OPERATOR'
    );

    if (assignmentOperator) {
      const assignmentOperatorValue = assignmentOperator.value;

      // In case EqualityExpression deriviated to simple Identifier node.
      if (this._isIdentifier(expression)) {
        return {
          type: "AssignmentExpression",
          operator: assignmentOperatorValue,
          left: expression,
          right: this.AssignmentExpression(),
        }
      }

      throw new SyntaxError('Invalid left-hand side in the assignment expression. The identifier is expected.');
    }

    return expression;
  }

  _isIdentifier(expression) {
    return expression.type === 'Identifier';
  }

  /**
   * LogicalOrExpression => LogicalAndExpression (LOGICAL_OR_OPERATOR LobicalAndExpression)*;
   * LOGICAL_OR_OPERATOR => "||";
   *
   */
  LogicalOrExpression() {
    let leftOperand = this.LogicalAndExpression();

    while(this._check('LOGICAL_OR')) {
      const operator = this._eat('LOGICAL_OR');

      const rightOperand = this.LogicalAndExpression();

      leftOperand = this.LogicalNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  /**
   * LogicalAndExpression => EqualityExpression (LOGICAL_AND_OPERATOR EqualityExpression)*;
   * LOGICAL_AND_OPERATOR => "&&";
   *
   */
  LogicalAndExpression() {
    let leftOperand = this.EqualityExpression();

    while(this._check('LOGICAL_AND')) {
      const operator = this._eat('LOGICAL_AND');

      const rightOperand = this.EqualityExpression();

      leftOperand = this.LogicalNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  /**
   * EqualityExpression => ComparisonExpression (EQUALITY_OPERATOR ComparisonExpression)*;
   * EQUALITY_OPERATOR => "==" | "!=";
   *
   */
  EqualityExpression() {
    let leftOperand = this.ComparisonExpression();

    while (this._check('EQUALITY_OPERATOR')) {
      const operator = this._eat('EQUALITY_OPERATOR');

      const rightOperand = this.ComparisonExpression();

      leftOperand = this.BinaryNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  /**
   * ComparisonExpression => AdditiveExpression (COMPARISON_OPERATOR AdditiveExpression)*
   * COMPARISON_OPERATOR => ">" | ">=" | "<" | "<=";
   *
   */
  ComparisonExpression() {
    let leftOperand = this.AdditiveExpression();

    while (this._check('COMPARISON_OPERATOR')) {
      const operator = this._eat('COMPARISON_OPERATOR');

      const rightOperand = this.AdditiveExpression();

      leftOperand = this.BinaryNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  /**
   * AdditiveExpression => MultiplicativeExpression ((+|-) MultiplicativeExpression);
   *
   */
  AdditiveExpression() {
    let leftOperand = this.MultiplicativeExpression();

    while (this._check('ADDITIVE_OPERATOR')) {
      const operator = this._eat('ADDITIVE_OPERATOR');

      const rightOperand = this.MultiplicativeExpression();

      leftOperand = this.BinaryNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  }

  /**
   * MultiplicativeExpression => UnaryExpression ((* | /) UnaryExpression);
   *
   */
  MultiplicativeExpression() {
    let leftOperand = this.UnaryExpression();

    while(this._check('MULTIPLICATIVE_OPERATOR')) {
      const operator = this._eat('MULTIPLICATIVE_OPERATOR');

      const rightOperand = this.UnaryExpression();

      leftOperand = this.BinaryNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  };

  FunctionDeclaration() {
    this._eat('FUNCTION');

    return this.Function();
  }

  FunctionParamsList() {
    this._eat('LEFT_PAREN');  
    
    const paramsList = [];

    if (!this._check('RIGHT_PAREN')) {
      do {
        paramsList.push(
          this.Identifier()
        );
      } while(this._match('COMMA'));
    }

    this._eat('RIGHT_PAREN');

    return paramsList;
  }

  Function() {
    const name = this.Identifier(); 

    const params = this.FunctionParamsList();

    const body = this.BlockStatement();

    return {
      type: "FunctionDeclaration",
      name,
      params,
      body,
    };
  }

  /**
   * Create ExpressionStatementNode 
   *   according to the grammar:
   *
   *   ExpressionStatement => Expression ";";
   */
  ExpressionStatement() {
    const expressionStatement = {
      type: "ExpressionStatement",
      expression: this.Expression(),
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
   * UnaryExpression => CallExpression | (("!" | "-") UnaryExpression)*;
   *
   */
  UnaryExpression() {
    const operator = this._match('ADDITIVE_OPERATOR', 'LOGICAL_NOT_OPERATOR');

    if (operator) {
      const argument = this.UnaryExpression();

      return this.UnaryNode(operator.value, argument);
    }

    return this.CallExpression();
  }

  MemberExpression() {
    let memberExpression = this.PrimaryExpression(); 

    while(this._check('.') || this._check('[')) {
      if (this._match('.')) {
        memberExpression = {
          type: "MemberExpression",
          object: memberExpression,
          computed: false,
          property: this.Identifier(),
        }
      }

      if (this._match('[')) {
        memberExpression = {
          type: "MemberExpression",
          object: memberExpression,
          computed: true,
          property: this.Expression(),
        }
        this._eat(']');
      }
    }

    return memberExpression;
  }

  CallExpression() {
    let callExpression = this.MemberExpression();

    if (!this._check('LEFT_PAREN')) { 
      return callExpression;
    }

    while (this._match('LEFT_PAREN')) {
      const argumentList = this._check('RIGHT_PAREN') 
        ? [] 
        : this.ArgumentList();

      callExpression = {
        type: "CallExpression",
        callee: callExpression,
        arguments: argumentList,
      }

      this._eat('RIGHT_PAREN');
    }

    return callExpression;
  }

  ArgumentList() {
    let argumentList = [];

    do {
      argumentList.push(this.Expression()) 
    } while(this._match('COMMA'));

    return argumentList;
  }

  PrimaryExpression() {
    switch(this._lookahead.type) {
      case 'LEFT_PAREN':
        this._eat('LEFT_PAREN');

        const expression = this.Expression();

        this._eat('RIGHT_PAREN');

        return expression;

      case 'IDENTIFIER':
        return this.Identifier();

      default:
        return this.Literal();
    }
  }

  UnaryNode(operator, argument) {
    return {
      type: "UnaryExpression",
      operator, 
      argument,
    };
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

  BinaryNode(leftOperand, operator, rightOperand) {
    return {
      type: "BinaryExpression",
      operator,
      left: leftOperand,
      right: rightOperand, 
    };
  }
  
  LogicalNode(leftOperand, operator, rightOperand) {
    return {
      type: "LogicalExpression",
      operator,
      left: leftOperand,
      right: rightOperand, 
    };
  }


  Identifier() {
    const token = this._eat('IDENTIFIER');

    return {
      type: "Identifier",
      name: token.value, 
    }
  };

  /**
   * Literal => NumericLiteral | StringLiteral | BooleanLiteral | NullLiteral;
   *
   * NumbericLiteral => NUMBER;
   * StringLiteral => STRING;
   * BooleanLiteral => TRUE | FALSE;
   * NullLiteral => NULL;
   *
   */
  Literal() {
    switch(this._peek().type) {
      case 'NUMBER':
        return this.NumericLiteral();

      case 'STRING':
        return this.StringLiteral();

      case 'TRUE':
        return this.BooleanLiteral(true);

      case 'FALSE':
        return this.BooleanLiteral(false)

      case 'NULL':
        return this.NullLiteral()
    }

    throw new SyntaxError('Literal: unexpected literal production.');
  }

  /**
   * NullLiteral => NULL;
   *
   */
  NullLiteral() {
    const token = this._eat('NULL');

    return {
      type: 'NullLiteral',
      value: null,
    };
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

  /**
   * BooleanLiteral => TRUE | FALSE;
   *
   */
  BooleanLiteral(value) {
    this._eat(value ? 'TRUE' : 'FALSE');

    return {
      type: "LogicalLiteral",
      value: value,
    }
  }

  _match(...operatorsTypes) {
    for (const operatorType of operatorsTypes) {
      if (this._check(operatorType)) {
        return this._eat(operatorType); 
      } 
    }  

    return null;
  }

  _check(type) {
    if(this._isEOF()) { return false; }

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
  _eat(tokenType, errorMessage) {
    const nextToken = this._peek(); 

    if (nextToken == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected ${tokenType}`
      );
    }

    if (nextToken.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: ${nextToken.type}, expected ${tokenType}`);
    }

    /**
     * All checks have been done.
     *   Advance to the next token and return it.
     */

    this._lookahead = this._tokenizer.getNextToken();
    
    return nextToken;
  }
}

module.exports = {
  Parser,
}
