import { describe, expect, test } from '@jest/globals';
import '../../jest.setup';
import config from '../../src/config/common.js';
import { JxaCompiler, compile } from '../../src/lib/compilers.js';
import { outputTemplate } from '../../src/lib/output.js';
import {
    ArgsSerializer,
    FnSerializer,
    serialize,
} from '../../src/lib/serializers.js';
import { JxaCodeTemplate, fillTemplate } from '../../src/lib/templates.js';

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
        outputTemplate(code);

        await compile(JxaCompiler, {
            entryPath: config.entryPath,
            outputPath: config.outputPath,
        });

        expect(config.outputPath).toExist();
    });
});
