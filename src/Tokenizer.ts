import { TokenType, Token } from './types';

/**
 * Tokenizer spec
 *
 */

const Spec: [RegExp, null | TokenType][] = [
  [/^\s+/, null],

  [/^\/\/.*/, null],

  [/^\/\*([\s\S]*?)\*\//, null],

  [/^;/, TokenType.Semicolon],

  [/^{/, TokenType.LeftCurlyBrace],

  [/^}/, TokenType.RightCurlyBrace],

  [/^if/, TokenType.If],

  [/^function/, TokenType.Function],

  [/^return/, TokenType.Return],

  [/^while/, TokenType.While],

  [/^do/, TokenType.Do],

  [/^for/, TokenType.For],

  [/^else/, TokenType.Else],

  [/^\d+/, TokenType.Number],

  [/^\blet\b/, TokenType.Let],

  [/^true/, TokenType.True],

  [/^false/, TokenType.False],

  [/^null/, TokenType.Null],

  [/^[a-zA-Z_]+\w*/, TokenType.Identifier],

  [/^&&/, TokenType.LogicalAnd],

  [/^\|\|/, TokenType.LogicalOr],

  [/^[\+\-\*]=/, TokenType.ComplexAssignmentOperator],

  [/^[+-]/, TokenType.AdditiveOperator],

  [/^[=!]=/, TokenType.EqualityOperator],

  [/^=/, TokenType.SimpleAssignmentOperator],

  [/^[<|>]=?/, TokenType.ComparisonOperator],

  [/^[*|/]/, TokenType.MultiplicativeOperator],

  [/^,/, TokenType.Comma],

  [/^\./, TokenType.Dot],

  [/^\[/, TokenType.LeftSquareBracket],
  [/^\]/, TokenType.RightSquareBracket],

  [/^\(/, TokenType.LeftParen],

  [/^\)/, TokenType.RightParen],

  [/^!/, TokenType.LogicalNotOperator],

  [/^"[^"]*"/, TokenType.String],
  [/^'[^']*'/, TokenType.String],
];

/**
 * Lazily pulls a token from a stream.
 *
 */

/**
 * init is the main method of the Tokenizer. It:
 *
 * - stores the parsing string into the internal private property;
 *
 * - initializes the cursor property with the initial value equals to 0.
 *     We need this property, cause Tokenizer tracks the position of every character
 *     and groups characters together into the tokens. Cursor is used to get an access
 *     to every new character like: "this.string[this.cursor]".
 *
 * Tokenizer should return next token on demand. 
 *   "getNextToken" method does exactly such a thing.
 */

export class Tokenizer {
  private _cursor: number = 0;
  private _string: string = '';

  /**
   * Initializes the string.
   *
   */
  init(string: string) {
    this._string = string;
  }

  /**
   * Whether we still have more tokens
   *
   */
  hasMoreTokens(): boolean {
    return this._cursor < this._string.length;
  }

  /**
   * If the cursor reaches the end of a string,
   *   it means that we reached the end of file (EOF).
   *
   */
  isEOF(): boolean {
    return this._cursor === this._string.length;
  }

  /**
   * Obtains next token.
   *
   */
  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const [regexpPattern, tokenType] of Spec) {
      const matchedValue = this.match(regexpPattern, string);

      /**
       * If there is no match for the current regexp pattern,
       *   search new token for the next regexp pattern.
       *
       */
      if (matchedValue === null) {
        continue;
      }

      /**
       * If there is no token for the 
       *   current regexp pattern, just skip the matched value
       *   and search for new token.
       *
       */
      if (tokenType === null) {
        return this.getNextToken();  
      }

      return {
        type: tokenType,
        value: matchedValue,
      };
    }

    /**
     * If we went trough the whole string and haven't found 
     *   matched value, the string contains invalid substring,
     *   substring which can't be recognised by the parser..
     *
     */
    throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }

  match(regexpPattern: RegExp, string: string): string | null {
    const match = regexpPattern.exec(string);

    if (!match) {
      return null;
    }

    this._cursor += match[0].length;

    return match[0];
  }
}