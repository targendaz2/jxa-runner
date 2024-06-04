import fs from 'node:fs';
import path from 'node:path';
import webpack from 'webpack';
import type { CompilerOptions } from '../types.js';

export function generateWebpackConfig(
    entryPath: fs.PathLike,
    outputPath: fs.PathLike,
): webpack.Configuration {
    return {
        entry: entryPath.toString(),
        mode: 'production',
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

export function generateWebpackCompiler(
    config: webpack.Configuration,
    options?: CompilerOptions,
): webpack.Compiler {
    const compiler = webpack(config);

    if (options) {
        compiler.inputFileSystem = options.inputFileSystem
            ? options.inputFileSystem
            : null;
        compiler.outputFileSystem = options.outputFileSystem
            ? options.outputFileSystem
            : null;
    }

    return compiler;
}
