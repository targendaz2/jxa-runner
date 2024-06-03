import path from 'node:path';
import { packageDirectorySync } from 'pkg-dir';

const entryPath = path.resolve(packageDirectorySync()!, '.tmp', 'index.js');

const config = {
    entryPath,
};

export default config;
