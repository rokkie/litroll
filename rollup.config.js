import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
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
  watch: {
    buildDelay: 500,
    exclude: 'node_modules/**',
    chokidar: {
      useFsEvents: false,
    },
  },
  plugins: [
    eslint(),
    typescript(),
    resolve(),
    styles({ autoModules: true, dts: true, sourceMap: true, namedExports: true }),
    babel({ babelHelpers: 'bundled' }),
    html({ template }),
  ],
};
