module.exports = (test) => {
  test(`
function square(x) {
  return x * x;
}
  `, {
    type: "Program",
    body: [{
      type: "FunctionDeclaration",
      name: {
        type: "Identifier",
        name: "square",
      },
      params: [{
        type: "Identifier",
        name: "x",
      }],
      body: {
        type: "BlockStatement",
        body: [{
          type: "ReturnStatement",
          argument: {
            type: "BinaryExpression",
            left: {
              type: "Identifier",
              name: "x",
            },
            operator: "*",
            right: {
              type: "Identifier",
              name: "x",
            }
          }
        }]
      }
    }]
  });

  test(`
function square(x) {
  return;
}
  `, {
    type: "Program",
    body: [{
      type: "FunctionDeclaration",
      name: {
        type: "Identifier",
        name: "square",
      },
      params: [{
        type: "Identifier",
        name: "x",
      }],
      body: {
        type: "BlockStatement",
        body: [{
          type: "ReturnStatement",
          argument: null
        }]
      }
    }]
  });

  test(`
function square(x) {}
  `, {
    type: "Program",
    body: [{
      type: "FunctionDeclaration",
      name: {
        type: "Identifier",
        name: "square",
      },
      params: [{
        type: "Identifier",
        name: "x",
      }],
      body: {
        type: "BlockStatement",
        body: []
      }
    }]
  });

  test(`
function square() {}
  `, {
    type: "Program",
    body: [{
      type: "FunctionDeclaration",
      name: {
        type: "Identifier",
        name: "square",
      },
      params: [],
      body: {
        type: "BlockStatement",
        body: []
      }
    }]
  });

  test(`
function square(x, y) {}
  `, {
    type: "Program",
    body: [{
      type: "FunctionDeclaration",
      name: {
        type: "Identifier",
        name: "square",
      },
      params: [{
        type: "Identifier",
        name: 'x',
      }, {
        type: "Identifier",
        name: 'y',
      }],
      body: {
        type: "BlockStatement",
        body: []
      }
    }]
  });
}
