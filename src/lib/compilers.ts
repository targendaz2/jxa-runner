import fs from 'node:fs';
import webpack from 'webpack';
import generateWebpackConfig from '../config/webpack.js';
import type {
    CompilerOptions,
    InputFileSystem,
    OutputFileSystem,
} from '../types.js';

interface Compiler<T extends CompilerOptions> {
    compile: (options: T) => Promise<void>;
}

export async function compile<T extends CompilerOptions>(
    compiler: Compiler<T>,
    options: T,
): Promise<void> {
    return compiler.compile(options);
}

// TODO: separate creating and running the compiler instance
export const JxaCompiler: Compiler<{
    entryPath: fs.PathLike;
    outputPath: fs.PathLike;
    inputFs?: InputFileSystem;
    outputFs?: OutputFileSystem;
}> = {
    async compile(options) {
        const { entryPath, outputPath } = options;

        const webpackConfig = generateWebpackConfig(entryPath, outputPath);
        const compiler = webpack(webpackConfig);

        if (options.inputFs) {
            compiler.inputFileSystem = options.inputFs;
        }
        if (options.outputFs) {
            compiler.outputFileSystem = options.outputFs;
        }

        return new Promise((resolve, reject) =>
            compiler.run((err, stats) => {
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
