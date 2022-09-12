module.exports = (test) => {
  test(`
callMethod();
  `, {
    type: "Program",
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "callMethod",
          },
          arguments: [],
        }
      }
    ]
  });

  test(`
callMethod(x, y);
  `, {
    type: "Program",
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "callMethod",
          },
          arguments: [{
            type: 'Identifier',
            name: 'x',
          }, {
            type: "Identifier",
            name: 'y',
          }],
        }
      }
    ]
  });

  test(`
callMethod(x, y)();
  `, {
    type: "Program",
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: "CallExpression",
          callee: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "callMethod",
            },
            arguments: [{
              type: 'Identifier',
              name: 'x',
            }, {
              type: "Identifier",
              name: 'y',
            }],
          },
          arguments: [],
        },
      }
    ]
  });
};
