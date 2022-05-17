module.exports = (test) => {
  test(`    
/** 
 *
 * Block comment will be emitted
 */
42; 

// Some inline comment will be also emitted
"hello";
    `, {
      type: "Program",
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: "NumericLiteral",
            value: 42,
          },
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: "StringLiteral",
            value: "hello",
          }
        }
      ],
    });
};
