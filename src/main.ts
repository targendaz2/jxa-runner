import path from 'node:path';
import fs from 'fs-extra';
import { packageDirectorySync } from 'pkg-dir';

/** Serializes JavaScript function arguments as a single string. */
export function serializeArgs(...args: any[]): string {
    return args
        .map((arg) => {
            if (arg instanceof Date) {
                return `new Date("${arg.toISOString()}")`;
            }

            switch (typeof arg) {
                case 'object':
                    return JSON.stringify(arg);
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

    // Write the serialized function to file
    outputCode(serializedFn);
}
