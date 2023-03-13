import path from 'node:path';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import omt from '@surma/rollup-plugin-off-main-thread';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import styles from 'rollup-plugin-styles';
import template from './index.mjs';

export default {
  input: 'src/main.mts',
  output: {
    dir: 'dist',
    format: 'esm',
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
    injectProcessEnv({
      NODE_ENV: 'production',
    }, {
      exclude: '**/*.scss'
    }),
    eslint(),
    typescript(),
    resolve(),
    omt(),
    url({ fileName: '[dirname][hash][extname]', destDir: 'dist', sourceDir: path.join(import.meta.url, 'src') }),
    styles({ dts: true, sourceMap: true, namedExports: true, modules: true }),
    babel({ babelHelpers: 'bundled' }),
    html({ template, title: 'Kernel Convolution Off the Main Thread' }),
  ],
};
