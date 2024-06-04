import fs from 'fs-extra';
import config from './config.js';
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

export async function run<T>(
    jxaFn: (...args: any[]) => T,
    options: RunOptions = {},
): Promise<void> {
    // Parse options
    const { args, imports } = { args: [], imports: {}, ...options };

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
    fs.outputFileSync(config.entryPath, code);
}

export function runSync<T>(
    jxaFn: (...args: any[]) => T,
    options: RunOptions = {},
): void {
    // Parse options
    const { args, imports } = { args: [], imports: {}, ...options };

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
    fs.outputFileSync(config.entryPath, code);
}
