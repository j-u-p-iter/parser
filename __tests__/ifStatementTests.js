module.exports = (test) => {
  test(`
if (x) {
  y = 5;
} else {
  z = 7;
}
  `, {
    type: "Program",
    body: [
      {
        type: "ifStatement",
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "y",
                },
                right: {
                  type: "NumericLiteral",
                  value: 5,
                }
              }
            }
          ]
        },
        alternate: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "z",
                },
                right: {
                  type: "NumericLiteral",
                  value: 7,
                }
              }
            }
          ]
        }
      }
    ]
  })
};
