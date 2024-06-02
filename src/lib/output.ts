import path from 'node:path';
import fs from 'fs-extra';
import { packageDirectorySync } from 'pkg-dir';
import type { FilledTemplate } from '../types.js';

export const entryPath = path.resolve(
    packageDirectorySync()!,
    '.tmp',
    'index.js',
);

/** Writes a filled template to a file. */
export function outputTemplate(content: FilledTemplate): void {
    fs.outputFileSync(entryPath, content);
}
