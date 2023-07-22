import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default [
  {
    input: 'src/services/JScript.ts',
    output: {
      file: 'dist/JScript.js',
      format: 'es',
      name: 'first',
    },
    plugins: [typescript({
      resolveJsonModule: true
    }), json()],
  },
  {
    input: 'src/services/ExprNodeGenerator.ts',
    output: {
      file: 'dist/ExprNodeGenerator.js',
      format: 'es',
      name: 'second',
    },
    plugins: [typescript({
      resolveJsonModule: true
    }), json()],
  },
];
