module.exports = (test) => {
  test(`    
2 + 2;
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        }
      }],
    });

  test(`
2 + 3 - 1;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "-",
        left: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "NumericLiteral",
            value: 2,
          },
          right: {
            type: "NumericLiteral",
            value: 3,
          }
        },
        right: {
          type: "NumericLiteral",
          value: 1,
        }
      }
    }]
  })

  test(`
2 * 3;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "NumericLiteral",
          value: 2,
        },
        right: {
          type: "NumericLiteral",
          value: 3,
        },
      }
    }]
  })

  test(`
4 + 3 * 2;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "NumericLiteral",
          value: 4,
        },
        right: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "NumericLiteral",
            value: 3,
          },
          right: {
            type: "NumericLiteral",
            value: 2
          },
        },
      }
    }]
  })

  test(`
5 < 3;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "<",
        left: {
          type: "NumericLiteral",
          value: 5,
        },
        right: {
          type: "NumericLiteral",
          value: 3,
        },
      },
    }],
  });

  test(`
5 == 3;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "==",
        left: {
          type: "NumericLiteral",
          value: 5,
        },
        right: {
          type: "NumericLiteral",
          value: 3,
        },
      },
    }],
  });

  test(`
5 == 3 != 7;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "!=",
        left: {
          type: "BinaryExpression",
          operator: "==",
          left: {
            type: "NumericLiteral",
            value: 5,
          },
          right: {
            type: "NumericLiteral",
            value: 3
          }
        },
        right: {
          type: "NumericLiteral",
          value: 7,
        },
      },
    }],
  })
};
