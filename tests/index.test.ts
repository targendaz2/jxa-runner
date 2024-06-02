import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { packageDirectorySync } from 'pkg-dir';
import '../jest.setup';
import { run, serializeArgs, serializeFn } from '../src/index';

describe('serialization tests', () => {
    test('can serialize arguments', () => {
        expect(serializeArgs(1, 'hello', true)).toEqualCode('1, "hello", true');
    });

    test('can serialize empty arguments list', () => {
        expect(serializeArgs()).toBe('');
    });

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
        run((name: string) => `Hello, ${name}`);
        const fileContents = fs.readFileSync(
            path.resolve(packageDirectorySync()!, '.tmp', 'index.ts'),
            {
                encoding: 'utf8',
            },
        );

        expect(fileContents).toEqualCode('(name) => `Hello, ${name}`');
    });
});
