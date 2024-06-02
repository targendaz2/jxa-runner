import path from 'node:path';
import fs from 'fs-extra';
import { packageDirectorySync } from 'pkg-dir';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsList,
    ImportsSerializer,
    serialize,
} from './serializers.js';
import { JxaCodeTemplate, fillTemplate } from './templates.js';

/** Writes serialized code to a file. */
export function outputCode(code: string): void {
    fs.outputFileSync(
        path.resolve(packageDirectorySync()!, '.tmp', 'index.js'),
        code,
    );
}

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
    outputCode(code);
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
    outputCode(code);
}
