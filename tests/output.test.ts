import fs from 'node:fs';
import { describe, expect, test } from '@jest/globals';
import '../jest.setup';
import config from '../src/config/common.js';
import { outputTemplate } from '../src/lib/output.js';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsSerializer,
    serialize,
} from '../src/lib/serializers.js';
import { JxaCodeTemplate, fillTemplate } from '../src/lib/templates.js';

describe('template output tests', () => {
    test('can write filled template to file', () => {
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
            imports: serializedImports,
        });
        outputTemplate(code);

        const fileContents = fs.readFileSync(config.entryPath, {
            encoding: 'utf8',
        });

        expect(fileContents).toEqualCode(`
            import z from "zod";
            const fn = (greeting, name) => \`\${greeting}, \${name}!\`;
            const result = fn("Welcome", "John");
            return JSON.stringify({ result });
        `);
    });
});
