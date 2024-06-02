import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { packageDirectorySync } from 'pkg-dir';
import '../jest.setup';
import { buildCode, outputCode, serializeArgs, serializeFn } from '../src/main';

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

describe('code building tests', () => {
    test('can build code from function', () => {
        const serializedFn = serializeFn(() => 'hello');
        const code = buildCode(serializedFn);
        expect(code).toEqualCode(`
            const fn = () => "hello";
            const result = fn();
            JSON.stringify({ result });
        `);
    });

    test('can build code from function with arguments', () => {
        const serializedFn = serializeFn((value: string) => value);
        const code = buildCode(serializedFn);
        expect(code).toEqualCode(`
            const fn = (value) => value;
            const result = fn();
            JSON.stringify({ result });
        `);
    });
});

describe('code writing tests', () => {
    test('can write code to file', () => {
        const serializedCode = serializeFn((name: string) => `Hello, ${name}`);
        outputCode(serializedCode);

        const fileContents = fs.readFileSync(
            path.resolve(packageDirectorySync()!, '.tmp', 'index.ts'),
            {
                encoding: 'utf8',
            },
        );

        expect(fileContents).toEqualCode('(name) => `Hello, ${name}`');
    });
});
