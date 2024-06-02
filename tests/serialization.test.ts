import { describe, expect, test } from '@jest/globals';
import '../jest.setup';
import {
    buildCode,
    serializeArgs,
    serializeFn,
    serializeImports,
} from '../src/main';

describe('argument serialization tests', () => {
    test('can serialize empty arguments list', () => {
        const serializedArgs = serializeArgs();
        expect(serializedArgs).toBe('');
    });

    test('can serialize number arguments', () => {
        const serializedArgs = serializeArgs(1, 2, 15);
        expect(serializedArgs).toEqualCode('1, 2, 15');
    });

    test('can serialize string arguments', () => {
        const serializedArgs = serializeArgs('Hello, world!', 'greeting');
        expect(serializedArgs).toEqualCode('"Hello, world!", "greeting"');
    });

    test('can serialize boolean arguments', () => {
        const serializedArgs = serializeArgs(true, false);
        expect(serializedArgs).toEqualCode('true, false');
    });

    test('can serialize Date arguments', () => {
        const serializedArgs = serializeArgs(new Date('2024-01-15T09:00:00Z'));
        expect(serializedArgs).toEqualCode(
            'new Date("2024-01-15T09:00:00.000Z")',
        );
    });

    test('can serialize array arguments', () => {
        const serializedArgs = serializeArgs([1, 2, 3], ['hello', 'world']);
        expect(serializedArgs).toEqualCode('[1, 2, 3], ["hello", "world"]');
    });

    test('can serialize object arguments', () => {
        const serializedArgs = serializeArgs(
            { name: 'John Smith', age: 37 },
            { name: 'Jane Smith', age: 23 },
        );
        // Prettier can't format the expected code, so I've manually formatted it
        expect(serializedArgs).toBe(
            '{"name":"John Smith","age":37},{"name":"Jane Smith","age":23}',
        );
    });
});

describe('imports serialization tests', () => {
    test('can serialize import', () => {
        const serializedImports = serializeImports({
            zod: 'z',
        });
        expect(serializedImports[0]).toEqualCode('import z from "zod";');
    });

    test('can serialize multiple imports', () => {
        const serializedImports = serializeImports({
            lodash: ['defaults', 'partition'],
            zod: 'z',
        });

        expect(serializedImports[0]).toEqualCode(
            'import { defaults, partition } from "lodash";',
        );
        expect(serializedImports[1]).toEqualCode('import z from "zod";');
    });
});

describe('function serialization tests', () => {
    test('can serialize function', () => {
        const serializedFn = serializeFn(() => 'hello');
        expect(serializedFn).toEqualCode('() => "hello"');
    });

    test('can serialize function with arguments', () => {
        const serializedFn = serializeFn((value: string) => value);
        expect(serializedFn).toEqualCode('(value) => value');
    });
});

describe('JXA code building tests', () => {
    test('can build JXA code from function', () => {
        const serializedFn = serializeFn(() => 'hello');
        const code = buildCode(serializedFn);
        expect(code).toEqualCode(`
            const fn = () => "hello";
            const result = fn();
            JSON.stringify({ result });
        `);
    });

    test('can build JXA code from function with arguments', () => {
        const serializedFn = serializeFn((value: string) => value);
        const serializedArgs = serializeArgs('John');

        const code = buildCode(serializedFn, serializedArgs);
        expect(code).toEqualCode(`
            const fn = (value) => value;
            const result = fn("John");
            JSON.stringify({ result });
        `);
    });
});
