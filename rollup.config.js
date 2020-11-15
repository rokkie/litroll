import babel from '@rollup/plugin-babel';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import styles from 'rollup-plugin-styles';
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
    styles({ autoModules: true, dts: true, sourceMap: true, namedExports: true }),
    babel({ babelHelpers: 'bundled' }),
    html({ template }),
  ],
};
