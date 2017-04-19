const path = require('path');

module.exports = env => {
    //console.error(env);
    return {
        entry: './src/gltf-viewer.ts',
        output: {
            filename: env == 'production' ? 'gltf-viewer.min.js' : 'gltf-viewer.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd'
        },
        externals: {
            "gl-matrix": "gl-matrix"
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
                    loader: 'ts-loader',
                    options: env == 'production' ? {
                        compilerOptions: {
                            "target": "es5",
                            "downlevelIteration": true
                        }
                    } : {}
                }
            ]
        }
    }
};