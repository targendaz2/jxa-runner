import fs from 'node:fs';
import { describe, expect, test } from '@jest/globals';
import { fs as memfs, vol } from 'memfs';
import { ufs } from 'unionfs';
import '../../jest.setup';
import { compile } from '../../src/lib/compilers.js';
import {
    ArgsSerializer,
    FnSerializer,
    serialize,
} from '../../src/lib/serializers.js';
import { JxaCodeTemplate, fillTemplate } from '../../src/lib/templates.js';
import packageFactory from '../factories/package.factory';

describe('JXA compilation tests', () => {
    test('can compile JXA code', async () => {
        const serializedFn = serialize(
            (greeting: string, name: string) => `${greeting}, ${name}!`,
            FnSerializer,
        );
        const serializedArgs = serialize(['Welcome', 'John'], ArgsSerializer);

        const code = fillTemplate(JxaCodeTemplate, {
            fn: serializedFn,
            args: serializedArgs,
        });

        const packageStructure = packageFactory.build({
            './src/index.js': code,
        });

        vol.fromJSON(packageStructure, '/jxa-runner-test');
        // @ts-expect-error 'need to cast memfs as the correct type'
        ufs.use(fs).use(memfs);

        await compile({
            entryPath: '/jxa-runner-test/src/index.js',
            outputPath: '/jxa-runner-test/.tmp/dist/bundle.js',
            filesystem: ufs,
        });

        expect(
            ufs.existsSync('/jxa-runner-test/.tmp/dist/bundle.js'),
        ).toBeTruthy();
    });
});
