module.exports = (test) => {
  test(`    
x.y;
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "MemberExpression",
          object: {
            type: 'Identifier',
            name: 'x', 
          },
          computed: false,
          property: {
            type: "Identifier",
            name: 'y',
          },
        }
      }],
    });
};
