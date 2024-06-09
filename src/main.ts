import cp from 'node:child_process';
import fs from 'fs-extra';
import config from './config.js';
import { compile } from './lib/compilers.js';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsSerializer,
    serialize,
} from './lib/serializers.js';
import { JxaCodeTemplate, fillTemplate } from './lib/templates.js';
import type { ImportsList } from './types.js';

interface RunOptions {
    args?: any[];
    imports?: ImportsList;
}

async function run<T>(
    jxaFn: (...args: any[]) => T,
    options: RunOptions = {},
): Promise<T> {
    // Parse options
    const { args, imports } = {
        args: [],
        imports: {},
        ...options,
    };

    // Serialize the arguments
    const serializedArgs = serialize(args, ArgsSerializer);

    // Serialize the imports
    const serializedImports = serialize(imports, ImportsSerializer);

    // Serialize the function
    const serializedFn = serialize(jxaFn, FnSerializer);

    // Build the JXA code
    const code = fillTemplate(JxaCodeTemplate, {
        fn: serializedFn,
        args: serializedArgs,
        imports: serializedImports,
    });

    // Write the JXA code to file
    await fs.outputFile(config.entryPath, code);

    // Compile the JXA code
    await compile({
        entryPath: config.entryPath,
        outputPath: config.outputPath,
    });

    // Run the compiled code
    const result = cp.execFileSync(
        '/usr/bin/osascript',
        ['-l', 'JavaScript', config.outputPath],
        {
            encoding: 'utf8',
        },
    );

    // Parse and return the result
    return JSON.parse(result).result;
}

export default run;
