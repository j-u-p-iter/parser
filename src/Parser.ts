/**
 * Letter parser: recursive descent implementation.
 *
 */

import { Tokenizer } from './Tokenizer';
import { TokenType, Token } from './types';

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

export class Parser {
  private _string: string = '';
  private _tokenizer: Tokenizer;
  private _lookahead: Token | null = null;

  constructor() {
    this._tokenizer = new Tokenizer();
  }

  /**
   * Parse a string inti an AST
   *
   */
  parse(string: string) {
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
  Program(): any {
    return {
      type: 'Program', 
      body: this.StatementList(),
    };
  }


  StatementList(): any {
    let statementList = [];

    while(this._peek() !== null && !this._check(TokenType.RightCurlyBrace)) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement(): any {
    switch(this._peek()!.type) {
      case TokenType.Semicolon:
        return this.EmptyStatement();

      case TokenType.LeftCurlyBrace:
        return this.BlockStatement();

      case TokenType.If:
        return this.IfStatement();

      case TokenType.While:
        return this.WhileStatement();

      case TokenType.Do:
        return this.DoWhileStatement();

      case TokenType.For:
        return this.ForStatement();

      case TokenType.Let:
        return this.VariableDeclaration();

      case TokenType.Function:
        return this.FunctionDeclaration();

      case TokenType.Return:
        return this.ReturnStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  ReturnStatement(): any {
    this._eat(TokenType.Return);

    const argument = !this._check(TokenType.Semicolon) ? this.Expression() : null;  

    this._eat(TokenType.Semicolon);

    return {
      type: "ReturnStatement",
      argument,
    };
  }

  /**
   * IfStatement => "if" "(" Expression ")" Statement ("else" Statement)?
   *
   */
  IfStatement(): any {
    this._eat(TokenType.If);

    this._eat(TokenType.LeftParen);

    const test = this.Expression(); 

    this._eat(TokenType.RightParen);

    const consequent = this.Statement(); 

    let alternate = null;

    if (this._match(TokenType.Else)) {
      alternate = this.Statement(); 
    }

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    };
  }

  ForStatement(): any {
    this._eat(TokenType.For);

    this._eat(TokenType.LeftParen);

    const init = this._check(TokenType.Let) 
      ? this.VariableDeclarationInit() 
      : !this._check(TokenType.Semicolon) ? this.Expression() : null; 

    this._eat(TokenType.Semicolon);

    const test = !this._check(TokenType.Semicolon) ? this.Expression() : null;

    this._eat(TokenType.Semicolon)

    const update = !this._check(TokenType.RightParen) ? this.Expression() : null;

    this._eat(TokenType.RightParen);

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
  WhileStatement(): any {
    this._eat(TokenType.While);

    this._eat(TokenType.LeftParen);

    const test = this.Expression();

    this._eat(TokenType.RightParen);

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
  DoWhileStatement(): any {
    this._eat(TokenType.Do);

    const body = this.Statement();

    this._eat(TokenType.While);

    this._eat(TokenType.LeftParen);

    const test = this.Expression();

    this._eat(TokenType.RightParen);

    this._eat(TokenType.Semicolon);

    return {
      type: "DoWhileStatement",
      body,
      test,
    }
  }

  VariableDeclarationInit(): any {
    this._eat(TokenType.Let);

    const variableDeclarationsList = this.VariableDeclarationsList();

    return {
      type: "VariableDeclaration",
      declarations: variableDeclarationsList,
    };
  }

  VariableDeclaration(): any {
    const variableDeclaration = this.VariableDeclarationInit();

    this._eat(TokenType.Semicolon);

    return variableDeclaration;
  }

  VariableDeclarationsList(): any {
    const variableDeclarationsList = [this.VariableDeclarator()];

    

    while(this._match(TokenType.Comma)) {
      variableDeclarationsList.push(this.VariableDeclarator());
    }

    return variableDeclarationsList;
  }

  VariableDeclarator(): any {
    const identifier = this.Identifier();

    let initializer = null;

    if (this._check(TokenType.SimpleAssignmentOperator)) {
      this._eat(TokenType.SimpleAssignmentOperator);

      initializer = this.Expression();
    }

    return {
      type: "VariableDeclarator",
      id: identifier,
      init: initializer, 
    };
  }

  EmptyStatement(): any {
    return { type: "EmptyStatement" };
  }

  /**
   * BlockStatement => "{" StatementList "}";
   *
   */
  BlockStatement(): any {
    this._eat(TokenType.LeftCurlyBrace);

    const statementList = this.StatementList();

    this._eat(TokenType.RightCurlyBrace);

    return {
      type: 'BlockStatement',
      body: statementList,
    }  
  }

  Expression(): any {
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
  AssignmentExpression(): any {
    const expression = this.LogicalOrExpression();

    const assignmentOperator = this._match(
      TokenType.SimpleAssignmentOperator, 
      TokenType.ComplexAssignmentOperator
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

  _isIdentifier(expression: any): boolean {
    return expression.type === 'Identifier';
  }

  /**
   * LogicalOrExpression => LogicalAndExpression (LOGICAL_OR_OPERATOR LobicalAndExpression)*;
   * LOGICAL_OR_OPERATOR => "||";
   *
   */
  LogicalOrExpression(): any {
    let leftOperand = this.LogicalAndExpression();

    while(this._check(TokenType.LogicalOr)) {
      const operator = this._eat(TokenType.LogicalOr);

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
  LogicalAndExpression(): any {
    let leftOperand = this.EqualityExpression();

    while(this._check(TokenType.LogicalAnd)) {
      const operator = this._eat(TokenType.LogicalAnd);

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
  EqualityExpression(): any {
    let leftOperand = this.ComparisonExpression();

    while (this._check(TokenType.EqualityOperator)) {
      const operator = this._eat(TokenType.EqualityOperator);

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
  ComparisonExpression(): any {
    let leftOperand = this.AdditiveExpression();

    while (this._check(TokenType.ComparisonOperator)) {
      const operator = this._eat(TokenType.ComparisonOperator);

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
  AdditiveExpression(): any {
    let leftOperand = this.MultiplicativeExpression();

    while (this._check(TokenType.AdditiveOperator)) {
      const operator = this._eat(TokenType.AdditiveOperator);

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
  MultiplicativeExpression(): any {
    let leftOperand = this.UnaryExpression();

    while(this._check(TokenType.MultiplicativeOperator)) {
      const operator = this._eat(TokenType.MultiplicativeOperator);

      const rightOperand = this.UnaryExpression();

      leftOperand = this.BinaryNode(
        leftOperand, 
        operator.value, 
        rightOperand
      );
    }

    return leftOperand;
  };

  FunctionDeclaration(): any {
    this._eat(TokenType.Function);

    return this.Function();
  }

  FunctionParamsList(): any {
    this._eat(TokenType.LeftParen);  
    
    const paramsList = [];

    if (!this._check(TokenType.RightParen)) {
      do {
        paramsList.push(
          this.Identifier()
        );
      } while(this._match(TokenType.Comma));
    }

    this._eat(TokenType.RightParen);

    return paramsList;
  }

  Function(): any {
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
  ExpressionStatement(): any {
    const expressionStatement = {
      type: "ExpressionStatement",
      expression: this.Expression(),
    };

    /**
     * We don't need the ";" token, so we just emit it,
     *   instead of keeping it in the variable.
     *
     */
    this._eat(TokenType.Semicolon);

    return expressionStatement;
  }
  
  /**
   * UnaryExpression => CallExpression | (("!" | "-") UnaryExpression)*;
   *
   */
  UnaryExpression(): any {
    const operator = this._match(TokenType.AdditiveOperator, TokenType.LogicalNotOperator);

    if (operator) {
      const argument = this.UnaryExpression();

      return this.UnaryNode(operator.value, argument);
    }

    return this.CallExpression();
  }

  MemberExpression(): any {
    let memberExpression = this.PrimaryExpression(); 

    while(this._check(TokenType.Dot) || this._check(TokenType.LeftSquareBracket)) {
      if (this._match(TokenType.Dot)) {
        memberExpression = {
          type: "MemberExpression",
          object: memberExpression,
          computed: false,
          property: this.Identifier(),
        }
      }

      if (this._match(TokenType.LeftSquareBracket)) {
        memberExpression = {
          type: "MemberExpression",
          object: memberExpression,
          computed: true,
          property: this.Expression(),
        }
        this._eat(TokenType.RightSquareBracket);
      }
    }

    return memberExpression;
  }

  CallExpression() {
    let callExpression = this.MemberExpression();

    if (!this._check(TokenType.LeftParen)) { 
      return callExpression;
    }

    while (this._match(TokenType.LeftParen)) {
      const argumentList = this._check(TokenType.RightParen) 
        ? [] 
        : this.ArgumentList();

      callExpression = {
        type: "CallExpression",
        callee: callExpression,
        arguments: argumentList,
      }

      this._eat(TokenType.RightParen);
    }

    return callExpression;
  }

  ArgumentList(): any {
    let argumentList = [];

    do {
      argumentList.push(this.Expression()) 
    } while(this._match(TokenType.Comma));

    return argumentList;
  }

  PrimaryExpression(): any {
    switch(this._lookahead!.type) {
      case TokenType.LeftParen:
        this._eat(TokenType.LeftParen);

        const expression = this.Expression();

        this._eat(TokenType.RightParen);

        return expression;

      case TokenType.Identifier:
        return this.Identifier();

      default:
        return this.Literal();
    }
  }

  UnaryNode(operator: any, argument: any): any {
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

  BinaryNode(leftOperand: any, operator: any, rightOperand: any): any {
    return {
      type: "BinaryExpression",
      operator,
      left: leftOperand,
      right: rightOperand, 
    };
  }
  
  LogicalNode(leftOperand: any, operator: any, rightOperand: any): any {
    return {
      type: "LogicalExpression",
      operator,
      left: leftOperand,
      right: rightOperand, 
    };
  }


  Identifier(): any {
    const token = this._eat(TokenType.Identifier);

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
  Literal(): any {
    switch(this._peek()!.type) {
      case TokenType.Number:
        return this.NumericLiteral();

      case TokenType.String:
        return this.StringLiteral();

      case TokenType.True:
        return this.BooleanLiteral(true);

      case TokenType.False:
        return this.BooleanLiteral(false)

      case TokenType.Null:
        return this.NullLiteral()
    }

    throw new SyntaxError('Literal: unexpected literal production.');
  }

  /**
   * NullLiteral => NULL;
   *
   */
  NullLiteral(): any {
    const token = this._eat(TokenType.Null);

    return {
      type: 'NullLiteral',
      value: null,
    };
  }

  /**
   * NumericLiteral => NUMBER;
   *
   */
  NumericLiteral(): any {
    const token = this._eat(TokenType.Number);

    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    };
  }

  /**
   * StringLiteral => STRING;
   *
   */
  StringLiteral(): any {
    const token = this._eat(TokenType.String);

    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1),
    };
  }

  /**
   * BooleanLiteral => TRUE | FALSE;
   *
   */
  BooleanLiteral(value: true | false): any {
    this._eat(value ? TokenType.True : TokenType.False);

    return {
      type: "LogicalLiteral",
      value: value,
    }
  }

  _match(...operatorsTypes: TokenType[]): Token | null {
    for (const operatorType of operatorsTypes) {
      if (this._check(operatorType)) {
        return this._eat(operatorType); 
      } 
    }  

    return null;
  }

  _check(type: TokenType): boolean {
    if(this._isEOF()) { return false; }

    return this._peek()!.type === type;
  }

  _isEOF(): boolean {
    return this._tokenizer.isEOF();
  }

  /**
   * Looking ahead the next token.
   */
  _peek(): Token | null {
    return this._lookahead;
  }

  /**
   * Validates current token before
   *   returning it from the parser.
   */
  _eat(tokenType: TokenType): Token {
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
