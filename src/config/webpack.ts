import fs from 'node:fs';
import path from 'node:path';
import { Configuration } from 'webpack';

export default function generateWebpackConfig(
    entryPath: fs.PathLike,
    outputPath: fs.PathLike,
): Configuration {
    return {
        entry: entryPath.toString(),
        mode: 'production',
        module: {},
        optimization: {
            concatenateModules: true,
            minimize: true,
        },
        output: {
            filename: path.basename(outputPath.toString()),
            iife: false,
            path: path.dirname(outputPath.toString()),
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
    };
}
