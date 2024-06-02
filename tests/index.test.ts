import { describe, expect, test } from '@jest/globals';
import '../jest.setup';
import { run } from '../src/index';

describe('serialization tests', () => {
    test('can serialize JXA function', () => {
        expect(run(() => 'hello')).toEqualCode('() => "hello"');
    });
});
