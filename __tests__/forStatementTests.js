module.exports = (test) => {
  test(`
for (let i = 0; i < 10; i += 1) {
  x = 10;
}
  `, {
    type: "Program",
    body: [
      {
        type: "ForStatement",
        init: {
          type: "VariableDeclaration",
          declarations: [{
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "i",
            },
            init: {
              type: "NumericLiteral",
              value: 0,
            }
          }]
        },
        test: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "NumericLiteral",
            value: 10,
          }
        },
        update: {
          type: "AssignmentExpression",
          operator: "+=",
          left: {
            type: "Identifier",
            name: "i",
          },
          right: {
            type: "NumericLiteral",
            value: 1,
          }
        },
        body: {
          type: "BlockStatement",
          body: [{
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumericLiteral",
                value: 10,
              }
            }
          }]
        }
      }
    ]
  })
};
