import path from 'node:path';
import fs from 'fs-extra';
import { packageDirectorySync } from 'pkg-dir';

/** Serializes JavaScript function arguments as a single string. */
export function serializeArgs(...args: any[]): string {
    return args
        .map((arg) => {
            switch (typeof arg) {
                case 'string':
                    return `"${arg}"`;
                default:
                    return arg.toString();
            }
        })
        .toString();
}

/** Serializes a JavaScript function as a string. */
export function serializeFn<T>(fn: (...args: any[]) => T): string {
    return fn.toString();
}

export function run<T>(jxaFn: (...args: any[]) => T, args: any[] = []): void {
    // Serialize the arguments
    const serializedArgs = serializeArgs(args);

    // Serialize the function
    const serializedFn = serializeFn(jxaFn);

    // Write the serialized function to file
    fs.outputFileSync(
        path.resolve(packageDirectorySync()!, '.tmp', 'index.ts'),
        serializedFn,
    );
}
