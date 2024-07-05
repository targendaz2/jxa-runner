import { describe, expect, test } from '@jest/globals';
import 'jest-extended-code';
import {
    ArgsSerializer,
    FnSerializer,
    ImportsSerializer,
    serialize,
} from '../../src/lib/serializers.js';

describe('argument serialization tests', () => {
    test('can serialize empty arguments list', () => {
        const serializedArgs = serialize([], ArgsSerializer);
        expect(serializedArgs).toBe('');
    });

    test('can serialize number arguments', () => {
        const serializedArgs = serialize([1, 2, 15], ArgsSerializer);
        expect(serializedArgs).toEqualCode('1, 2, 15');
    });

    test('can serialize string arguments', () => {
        const serializedArgs = serialize(
            ['Hello, world!', 'greeting'],
            ArgsSerializer,
        );
        expect(serializedArgs).toEqualCode('"Hello, world!", "greeting"');
    });

    test('can serialize boolean arguments', () => {
        const serializedArgs = serialize([true, false], ArgsSerializer);
        expect(serializedArgs).toEqualCode('true, false');
    });

    test('can serialize Date arguments', () => {
        const serializedArgs = serialize(
            new Date('2024-01-15T09:00:00Z'),
            ArgsSerializer,
        );
        expect(serializedArgs).toEqualCode(
            'new Date("2024-01-15T09:00:00.000Z")',
        );
    });

    test('can serialize array arguments', () => {
        const serializedArgs = serialize(
            [
                [1, 2, 3],
                ['hello', 'world'],
            ],
            ArgsSerializer,
        );
        expect(serializedArgs).toEqualCode('[1, 2, 3], ["hello", "world"]');
    });

    test('can serialize object arguments', () => {
        const serializedArgs = serialize(
            [
                { name: 'John Smith', age: 37 },
                { name: 'Jane Smith', age: 23 },
            ],
            ArgsSerializer,
        );
        // Prettier can't format the expected code, so I've manually formatted it
        expect(serializedArgs).toBe(
            '{"name":"John Smith","age":37},{"name":"Jane Smith","age":23}',
        );
    });
});

describe('imports serialization tests', () => {
    test('can serialize import', () => {
        const serializedImports = serialize(
            {
                zod: 'z',
            },
            ImportsSerializer,
        );
        expect(serializedImports).toEqualCode('import z from "zod";');
    });

    test('can serialize multiple imports', () => {
        const serializedImports = serialize(
            {
                lodash: ['defaults', 'partition'],
                zod: 'z',
            },
            ImportsSerializer,
        );

        expect(serializedImports).toEqualCode(`
            import { defaults, partition } from "lodash";
            import z from "zod";
        `);
    });
});

describe('function serialization tests', () => {
    test('can serialize function', () => {
        const serializedFn = serialize(() => 'hello', FnSerializer);
        expect(serializedFn).toEqualCode('() => "hello"');
    });

    test('can serialize function with arguments', () => {
        const serializedFn = serialize((value: string) => value, FnSerializer);
        expect(serializedFn).toEqualCode('(value) => value');
    });
});
