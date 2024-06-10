import { describe, expect, test } from '@jest/globals';
import { vol } from 'memfs';
import { mirrorSync } from 'memfs-mirror';
import tmp from 'tmp';
import '../jest.setup.js';
import run from '../src/main.js';
import packageFactory from './factories/package.factory.js';

describe('JXA code running', () => {
    test('can run JXA code', async () => {
        const packageStructure = packageFactory.build();
        vol.fromJSON(packageStructure, '/jxa-runner-test1');

        const tmpDir = tmp.dirSync();

        mirrorSync('/jxa-runner-test1', tmpDir.name, vol);

        process.chdir(tmpDir.name);
        const result = await run(() => 1 + 2);
        expect(result).toBe(3);
    });
});
