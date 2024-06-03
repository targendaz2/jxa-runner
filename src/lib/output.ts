import fs from 'fs-extra';
import config from '../config/common.js';
import type { FilledTemplate } from '../types.js';

/** Writes a filled template to a file. */
export function outputTemplate(content: FilledTemplate): void {
    fs.outputFileSync(config.entryPath, content);
}
