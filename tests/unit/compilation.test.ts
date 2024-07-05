import cp from 'node:child_process';
import fs from 'node:fs';
import { describe, expect, test } from '@jest/globals';
// import { mirrorSync } from 'memfs-mirror';
import 'jest-extended-code';
import { fs as memfs, vol } from 'memfs';
import { ufs } from 'unionfs';
import { compile } from '../../src/lib/compilers.js';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsSerializer,
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

        vol.fromJSON(packageStructure, '/jxa-runner-test1');
        // @ts-expect-error 'need to cast memfs as the correct type'
        ufs.use(fs).use(memfs);

        await compile({
            entryPath: '/jxa-runner-test1/src/index.js',
            outputPath: '/jxa-runner-test1/.tmp/dist/bundle.js',
            filesystem: ufs,
        });

        expect(
            ufs.existsSync('/jxa-runner-test1/.tmp/dist/bundle.js'),
        ).toBeTruthy();
    });

    test('can compile JXA code with local dependencies', async () => {
        // including this so eslint doesn't complain about the JXA function
        const greet = (name: string) => `Hello, ${name}!`;

        const serializedFn = serialize(
            (name: string) => greet(name),
            FnSerializer,
        );
        const serializedArgs = serialize(['John'], ArgsSerializer);

        const serializedImports = serialize(
            {
                './helpers': ['greet'],
            },
            ImportsSerializer,
        );

        const code = fillTemplate(JxaCodeTemplate, {
            fn: serializedFn,
            args: serializedArgs,
            imports: serializedImports,
        });

        const packageStructure = packageFactory.build({
            './src/index.js': code,
            './src/helpers.js':
                'export const greet = (name) => `Hello, ${name}!`;',
        });

        vol.fromJSON(packageStructure, '/jxa-runner-test2');
        // @ts-expect-error 'need to cast memfs as the correct type'
        ufs.use(fs).use(memfs);

        await compile({
            entryPath: '/jxa-runner-test2/src/index.js',
            outputPath: '/jxa-runner-test2/.tmp/dist/bundle.js',
            filesystem: ufs,
        });

        const result = JSON.parse(
            cp.execFileSync(
                '/usr/bin/osascript',
                [
                    '-l',
                    'JavaScript',
                    '-e',
                    ufs
                        .readFileSync('/jxa-runner-test2/.tmp/dist/bundle.js')
                        .toString(),
                ],
                {
                    encoding: 'utf8',
                },
            ),
        );

        expect(result).toEqual({ result: 'Hello, John!' });
    });
});
