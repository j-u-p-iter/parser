module.exports = (test) => {
  test(`    
let x = 5;
  `, {
      type: "Program",
      body: [{
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        ],
      }],
    });

  test(`    
let x = 4, y = 5;
  `, {
      type: "Program",
      body: [{
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: "NumericLiteral",
              value: 4,
            },
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        ],
      }],
    });

  test(`    
let x, y = 5;
  `, {
      type: "Program",
      body: [{
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: {
              type: "NumericLiteral",
              value: 5,
            },
          },
        ],
      }],
    });

  test(`    
let x, y;
  `, {
      type: "Program",
      body: [{
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: null,
          },
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: null,
          },
        ],
      }],
    });

  test(`    
let x = y = 5;
  `, {
      type: "Program",
      body: [{
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'y',
              },
              right: {
                type: 'NumericLiteral',
                value: 5,
              },
            },
          },
        ],
      }],
    });
};
