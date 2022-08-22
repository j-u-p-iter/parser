const { Parser } = require('../src/Parser');

const parser = new Parser();

const program = `    
do {
  x -= 1;
} while (x > 10);
`;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2))
