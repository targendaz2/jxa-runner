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

/** Builds JXA code from a serialized function and its arguments. */
export function buildCode(
    serializedFn: string,
    serializedArgs: string = '',
): string {
    return `
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

export function run<T>(jxaFn: (...args: any[]) => T, args: any[] = []): void {
    // Serialize the arguments
    const serializedArgs = serializeArgs(args);

    // Serialize the function
    const serializedFn = serializeFn(jxaFn);

    // Build the JXA code
    const code = buildCode(serializedFn, serializedArgs);

    // Write the serialized function to file
    outputCode(code);
}
