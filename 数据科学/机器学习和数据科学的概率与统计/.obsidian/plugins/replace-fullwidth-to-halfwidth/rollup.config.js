const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    input: 'main.ts',
    output: {
        dir: '.',
        sourcemap: 'inline',
        format: 'cjs',
        exports: 'default',
        name: 'full-width-to-half-width'
    },
    external: ['obsidian'],
    plugins: [
        typescript(),
        nodeResolve({browser: true}),
        commonjs()
    ]
};