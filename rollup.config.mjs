import terser from '@rollup/plugin-terser';

export default {
    input: 'dist/index.js',
    output: [
        {
            file: 'dist/beautiful-backgrounds.min.js',
            format: 'umd',
            name: 'version',
            plugins: [terser()]
        }
    ]
};
