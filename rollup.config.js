/*
 * @Description: rollup.config.js
 * @Version: 1.0.0
 * @Autor: michael_jier
 * @Date: 2021-08-19 09:36:58
 * @LastEditors: michael_jier
 * @LastEditTime: 2021-08-19 16:00:03
 */
// import { liveServer } from 'rollup-plugin-live-server'
import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const plugins = [
  terser({
    compress: {
      ecma: 2015,
      pure_getters: true,
    },
  }),
]

export default {
  input: 'lib/waterMark.ts',
  output: [
    {
      name: 'easyWatermark',
      file: 'dist/easyWatermark.min.js',
      format: 'iife', // umd cjs es iife
      exports: 'auto',
      // sourcemap: true,
      plugins,
    },
    {
      name: 'easyWatermark',
      file: 'dist/easyWatermark.cjs.js',
      format: 'cjs',
      plugins,
    },
    {
      name: 'easyWatermark',
      file: 'dist/easyWatermark.esm.js',
      format: 'esm',
      plugins,
    },
    {
      name: 'easyWatermark',
      file: 'dist/easyWatermark.umd.js',
      format: 'umd',
      plugins,
    },
  ],
  plugins: [
    resolve({ browser: true }),
    json(),
    commonjs({
      include: 'node_modules/**',
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      babelHelpers: 'runtime',
    }),
    // liveServer({
    //   port: 8090,
    //   host: '0.0.0.0',
    //   root: 'example',
    //   file: 'index.html',
    //   mount: [['/dist/wsHeartbeat.min.js', './dist/wsHeartbeat.min.js']],
    //   open: false,
    //   wait: 500,
    // }),
  ],
}
