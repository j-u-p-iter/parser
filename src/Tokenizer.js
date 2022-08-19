/**
 * Tokenizer spec
 *
 */

const Spec = [
  [/^\s+/, null],

  [/^\/\/.*/, null],

  [/^\/\*([\s\S]*?)\*\//, null],

  [/^;/, ';'],

  [/^{/, '{'],

  [/^}/, '}'],

  [/^if/, 'IF'],

  [/^else/, 'ELSE'],

  [/^\d+/, 'NUMBER'],

  [/^\blet\b/, 'let'],

  [/^[a-zA-Z_]+\w*/, 'IDENTIFIER'],

  [/^=/, 'SIMPLE_ASSIGNMENT_OPERATOR'],

  [/^[\+\-\*]=/, 'COMPLEX_ASSIGNMENT_OPERATOR'],

  [/^[+-]/, 'ADDITIVE_OPERATOR'],

  [/^[=!]=/, 'EQUALITY_OPERATOR'],

  [/^[<|>]=?/, 'COMPARISON_OPERATOR'],

  [/^[*|/]/, 'MULTIPLICATIVE_OPERATOR'],

  [/^,/, ','],

  [/^\(/, 'LEFT_PAREN'],

  [/^\)/, 'RIGHT_PAREN'],

  [/^!/, 'LOGICAL_NOT_OPERATOR'],

  [/^"[^"]*"/, 'STRING'],
  [/^'[^']*'/, 'STRING'],
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

class Tokenizer {
  /**
   * Initializes the string.
   *
   */
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  /**
   * Whether we still have more tokens
   *
   */
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  /**
   * Obrains next token.
   *
   */
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const [regexpPattern, tokenType] of Spec) {
      const matchedValue = this.match(regexpPattern, string);

      if (matchedValue === null) {
        continue;
      }

      if (tokenType === null) {
        return this.getNextToken();  
      }

      return {
        type: tokenType,
        value: matchedValue,
      };
    }

    throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }

  match(regexpPattern, string) {
    const match = regexpPattern.exec(string);

    if (!match) {
      return null;
    }

    this._cursor += match[0].length;

    return match[0];
  }
}

module.exports = {
  Tokenizer,
};
