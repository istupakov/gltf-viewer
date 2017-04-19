const path = require('path');
module.exports = {
    entry: './src/gltf-viewer.ts',
    output: {
        filename: 'bundle.js',
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, "src")
        ],
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            }
        ]
    },
    devtool: 'source-map',
};