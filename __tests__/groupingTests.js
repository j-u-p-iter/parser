module.exports = (test) => {
  test(`    
3 * (1 + 2);
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          right: {
            type: "BinaryExpression",
            operator: '+',
            left: {
              type: "NumericLiteral",
              value: 1,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          }
        }
      }],
    });
};
