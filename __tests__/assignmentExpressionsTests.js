module.exports = (test) => {
  test(`
    x = 5;
  `, {
    type: "Program",
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
          value: 5,
        },
      },
    }]
  });

  test(`
    x = y = 5;
  `, {
    type: "Program",
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
          type: "AssignmentExpression",
          operator: '=',
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
    }]
  });

  test(`
    x += 5;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "+=",
        left: {
          type: "Identifier",
          name: "x",
        },
        right: {
          type: "NumericLiteral",
          value: 5,
        },
      },
    }]
  });

  test(`
    x -= 5;
  `, {
    type: "Program",
    body: [{
      type: "ExpressionStatement",
      expression: {
        type: "AssignmentExpression",
        operator: "-=",
        left: {
          type: "Identifier",
          name: "x",
        },
        right: {
          type: "NumericLiteral",
          value: 5,
        },
      },
    }]
  });
};
