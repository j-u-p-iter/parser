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
  })
}
