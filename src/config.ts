import path from 'node:path';
import { packageDirectorySync } from 'pkg-dir';

const entryPath = path.resolve(packageDirectorySync()!, '.tmp', 'index.js');
const outputPath = path.resolve(path.dirname(entryPath), 'dist', 'bundle.js');
const maxBuffer = 1000 * 1000 * 100;

const config = {
    entryPath,
    outputPath,
    maxBuffer,
};

export default config;
