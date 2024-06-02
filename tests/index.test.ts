import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { packageDirectorySync } from 'pkg-dir';
import '../jest.setup';
import { outputCode, serializeArgs, serializeFn } from '../src/main';

describe('argument serialization tests', () => {
    test('can serialize arguments', () => {
        expect(serializeArgs(1, 'hello', true)).toEqualCode('1, "hello", true');
    });

    test('can serialize empty arguments list', () => {
        expect(serializeArgs()).toBe('');
    });

    test('can serialize number arguments', () => {
        expect(serializeArgs(1, 2, 15)).toEqualCode('1, 2, 15');
    });

    test('can serialize string arguments', () => {
        expect(serializeArgs('Hello, world!', 'greeting')).toEqualCode(
            '"Hello, world!", "greeting"',
        );
    });

    test('can serialize boolean arguments', () => {
        expect(serializeArgs(true, false)).toEqualCode('true, false');
    });

    test('can serialize Date arguments', () => {
        expect(serializeArgs(new Date('2024-01-15T09:00:00Z'))).toEqualCode(
            'new Date("2024-01-15T09:00:00.000Z")',
        );
    });
});

describe('function serialization tests', () => {
    test('can serialize function', () => {
        expect(serializeFn(() => 'hello')).toEqualCode('() => "hello"');
    });

    test('can serialize function with arguments', () => {
        expect(serializeFn((value: string) => value)).toEqualCode(
            '(value) => value',
        );
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
