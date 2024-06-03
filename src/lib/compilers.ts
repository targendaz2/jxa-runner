import fs from 'node:fs';
import webpack from 'webpack';
import generateWebpackConfig from '../config/webpack.js';

interface Compiler {
    compile: (entryPath: fs.PathLike, outputPath: fs.PathLike) => Promise<void>;
}

// TODO: change args to {file, compiler, options}
export async function compile(
    entryPath: fs.PathLike,
    outputPath: fs.PathLike,
    compiler: Compiler,
): Promise<void> {
    return compiler.compile(entryPath, outputPath);
}

export const JxaCompiler: Compiler = {
    async compile(entryPath, outputPath) {
        const webpackConfig = generateWebpackConfig(entryPath, outputPath);
        return new Promise((resolve, reject) =>
            webpack(webpackConfig, (err, stats) => {
                if (err) {
                    reject(err);
                } else if (stats && stats.hasErrors()) {
                    reject(stats.compilation.errors);
                } else {
                    resolve();
                }
            }),
        );
    },
};
