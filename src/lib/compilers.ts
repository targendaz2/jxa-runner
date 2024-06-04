import fs from 'node:fs';
import type { InputFileSystem, OutputFileSystem } from '../types.js';
import {
    generateWebpackCompiler,
    generateWebpackConfig,
} from './generators.js';

interface CompilerOptions {
    entryPath: fs.PathLike;
    outputPath: fs.PathLike;
    filesystem?: InputFileSystem | OutputFileSystem;
}

export async function compile(options: CompilerOptions): Promise<void> {
    const config = generateWebpackConfig(options.entryPath, options.outputPath);
    const compiler = generateWebpackCompiler(config, {
        inputFileSystem: options.filesystem as InputFileSystem,
        outputFileSystem: options.filesystem as OutputFileSystem,
    });

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
}
