const { Parser } = require('../src/Parser');

const parser = new Parser();

const program = `    
if (x > 10) {
  x -= 1;
}
    `;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2))
