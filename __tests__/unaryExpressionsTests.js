module.exports = (test) => {
  test(`    
!2;
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "!",
          argument: {
            type: "NumericLiteral",
            value: 2,
          },
        }
      }],
    });
};
