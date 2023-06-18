import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/JScript.ts',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [typescript({
    resolveJsonModule: true
  }), json()],
};
