import { TokenType } from './types';

export class Token {
  public type: TokenType;
  public line: number;
  public lexeme: string;

  constructor(type: TokenType, lexeme: string, line: number) {
    this.type = type; 
    this.lexeme = lexeme;
    this.line = line;
  }

  public toString(): string {
    return `${this.type} ${this.lexeme}`;
  }
}
