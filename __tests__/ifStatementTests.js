module.exports = (test) => {
  test(`
if (x) {
  y = 5;
}
  `, {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
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
        alternate: null,
      }
    ]
  })

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
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
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
                  value: 7
                }
              }
            }
          ]
        },
      }
    ]
  })

  test(`
if (x) y = 5;
  `, {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
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
            },
          },
        },
        alternate: null,
      }
    ]
  })

  test(`
if (x) y = 5; else z = 7;
  `, {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
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
            },
          },
        },
        alternate: {
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
            },
          }
        },
      }
    ]
  })

  test(`
if (x) if (z) y = 7; else y = 8;
  `, {
    type: "Program",
    body: [
      {
        type: "IfStatement",
        test: {
          type: "Identifier",
          name: "x",
        },
        consequent: {
          type: "IfStatement",
          test: {
            type: "Identifier",
            name: "z",
          },
          consequent: {
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
                value: 7,
              },
            },
          },
          alternate: {
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
                value: 8,
              },
            },
          },
        },
        alternate: null,
      }
    ]
  })
};
