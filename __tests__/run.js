const assert = require('assert');

const { Parser } = require('../src/Parser');

const specs = [
  //require('./literalsTests.js'), 
  //require('./statementListTests.js'),
  //require('./blockStatementTests.js'),
  //require('./mathExpressionsTests.js'),
  //require('./unaryExpressionsTests.js'),
  //require('./groupingTests.js'),
  //require('./assignmentExpressionsTests.js'),
  //require('./variableDeclarationStatementsTests.js'),
  require('./ifStatementTests.js'),
];

const parser = new Parser();

const test = (program, result) => {
  const ast = parser.parse(program);

  assert.deepEqual(ast, result);
}

specs.forEach((spec) => {
  spec(test);
});

console.log('All assertions passed successfully!')
