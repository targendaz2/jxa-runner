import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { packageDirectorySync } from 'pkg-dir';
import '../jest.setup';
import { outputCode } from '../src/main.js';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsSerializer,
    serialize,
} from '../src/serializers.js';
import { JxaCodeTemplate, fillTemplate } from '../src/templates.js';

describe('code output tests', () => {
    test('can write code to file', () => {
        const serializedFn = serialize(
            (greeting: string, name: string) => `${greeting}, ${name}!`,
            FnSerializer,
        );
        const serializedArgs = serialize(['Welcome', 'John'], ArgsSerializer);
        const serializedImports = serialize(
            {
                zod: 'z',
            },
            ImportsSerializer,
        );

        const code = fillTemplate(JxaCodeTemplate, {
            fn: serializedFn,
            args: serializedArgs,
            imports: serializedImports.join('\n'),
        });
        outputCode(code);

        const fileContents = fs.readFileSync(
            path.resolve(packageDirectorySync()!, '.tmp', 'index.js'),
            {
                encoding: 'utf8',
            },
        );

        expect(fileContents).toEqualCode(`
            import z from "zod";
            const fn = (greeting, name) => \`\${greeting}, \${name}!\`;
            const result = fn("Welcome", "John");
            JSON.stringify({ result });
        `);
    });
});
