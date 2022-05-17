const { Parser } = require('../src/Parser');

const parser = new Parser();

const program = `    
2 + 3 - 1; 

    `;

const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2))
