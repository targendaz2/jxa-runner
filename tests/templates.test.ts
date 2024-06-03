import { describe, expect, test } from '@jest/globals';
import '../jest.setup.js';
import {
    ArgsSerializer,
    FnSerializer,
    serialize,
} from '../src/lib/serializers.js';
import { JxaCodeTemplate, fillTemplate } from '../src/lib/templates.js';

describe('JXA code template tests', () => {
    test('can fill JXA code template from function', () => {
        const serializedFn = serialize(() => 'hello', FnSerializer);
        const code = fillTemplate(JxaCodeTemplate, {
            fn: serializedFn,
        });
        expect(code).toEqualCode(`
            const fn = () => "hello";
            const result = fn();
            JSON.stringify({ result });
        `);
    });

    test('can build JXA code from function with arguments', () => {
        const serializedFn = serialize((value: string) => value, FnSerializer);
        const serializedArgs = serialize('John', ArgsSerializer);

        const code = fillTemplate(JxaCodeTemplate, {
            fn: serializedFn,
            args: serializedArgs,
        });
        expect(code).toEqualCode(`
            const fn = (value) => value;
            const result = fn("John");
            JSON.stringify({ result });
        `);
    });
});
