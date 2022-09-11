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

  test(`    
x.y.z;
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "MemberExpression",
          object: {
            type: 'MemberExpression',
            object: {
              type: "Identifier",
              name: 'x',
            },
            computed: false,
            property: {
              type: "Identifier",
              name: 'y'
            },
          },
          computed: false,
          property: {
            type: "Identifier",
            name: 'z',
          },
        }
      }],
    });

  test(`    
a.b.c['d'];
  `, {
      type: "Program",
      body: [{
        type: "ExpressionStatement",
        expression: {
          type: "MemberExpression",
          object: {
            type: "MemberExpression",
            object: {
              type: 'MemberExpression',
              object: {
                type: "Identifier",
                name: 'a',
              },
              computed: false,
              property: {
                type: "Identifier",
                name: 'b'
              },
            },
            computed: false,
            property: {
              type: "Identifier",
              name: 'c',
            },
          },
          computed: true,
          property: {
            type: "StringLiteral",
            value: "d",
          }
        }
      }],
    });
};
