import path from 'node:path';
import webpack from 'webpack';
import config from './common.js';

const webpackConfig: webpack.Configuration = {
    devtool: 'source-map',
    entry: config.entryPath,
    mode: 'production',
    module: {},
    optimization: {
        concatenateModules: true,
        minimize: true,
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(path.dirname(config.entryPath), 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
};

export default webpackConfig;
