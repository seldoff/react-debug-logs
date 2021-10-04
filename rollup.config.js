import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.esm.js',
            format: 'es'
        },
        {
            file: 'dist/index.cjs.js',
            format: 'cjs'
        }
    ],
    external: ['react'],
    plugins: [typescript({tsconfig: './tsconfig.json', exclude: ['test/*', 'examples/*']})]
};
