import babel from '@rollup/plugin-babel';
const html = require('@rollup/plugin-html');
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import template from './index.js';

export default {
  input: 'src/app.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
    html({ template }),
  ],
};
