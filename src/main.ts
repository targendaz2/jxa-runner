import path from 'node:path';
import fs from 'fs-extra';
import { packageDirectorySync } from 'pkg-dir';
import serialize from 'serialize-javascript';

/** Serializes JavaScript function arguments as a single string. */
export function serializeArgs(...args: any[]): string {
    return args.map((arg) => serialize(arg)).toString();
}

/** Serializes a JavaScript function as a string. */
export function serializeFn<T>(fn: (...args: any[]) => T): string {
    return fn.toString();
}

/** Imports to include in JXA code. */
type ImportsList = { [key: string]: string | string[] | null };

/** Serializes imports as an array of strings.  */
export function serializeImports(imports: ImportsList): string[] {
    return Object.entries(imports).map(([module, values]) => {
        if (typeof values === 'string') {
            return `import ${values} from "${module}";`;
        } else if (Array.isArray(values)) {
            return `import {${values.toString()}} from "${module}";`;
        } else {
            return `import "${module}"`;
        }
    });
}

/** Builds JXA code from a serialized function and its arguments. */
export function buildCode(
    serializedFn: string,
    serializedArgs: string = '',
    serializedImports: string[] = [],
): string {
    return `
        ${serializedImports.join('\n')}
        const fn = ${serializedFn}
        const result = fn(${serializedArgs});
        JSON.stringify({ result });
    `;
}

/** Writes serialized code to a file. */
export function outputCode(code: string): void {
    fs.outputFileSync(
        path.resolve(packageDirectorySync()!, '.tmp', 'index.ts'),
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
    const serializedArgs = serializeArgs(args);

    // Serialize the imports
    const serializedImports = serializeImports(imports);

    // Serialize the function
    const serializedFn = serializeFn(jxaFn);

    // Build the JXA code
    const code = buildCode(serializedFn, serializedArgs, serializedImports);

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
    const serializedArgs = serializeArgs(args);

    // Serialize the imports
    const serializedImports = serializeImports(imports);

    // Serialize the function
    const serializedFn = serializeFn(jxaFn);

    // Build the JXA code
    const code = buildCode(serializedFn, serializedArgs, serializedImports);

    // Write the JXA code to file
    outputCode(code);
}
