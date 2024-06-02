import cp from 'node:child_process';
import { expect } from '@jest/globals';
import prettier from '@prettier/sync';
import type { MatcherFunction } from 'expect';
import type { Options as PrettierOptions } from 'prettier';

const toEqualCode: MatcherFunction<[expected: string]> = function (
    actual: any,
    expected: string,
) {
    const prettierConfig: PrettierOptions = {
        parser: 'babel',
        bracketSpacing: true,
        singleQuote: true,
        semi: true,
        tabWidth: 4,
        trailingComma: 'all',
    };

    function formatCode(code: string) {
        const formattedCode = prettier.format(
            code
                .split(/\r?\n/)
                .filter((line) => line.trim() !== '')
                .join('\n'),
            prettierConfig,
        );
        return formattedCode;
    }

    const typedActual = actual as string;

    let formattedActual: string;
    try {
        formattedActual = formatCode(typedActual);
    } catch (err) {
        return {
            pass: false,
            message: () => `the actual code is invalid:\n\n${err}`,
        };
    }

    let formattedExpected: string;
    try {
        formattedExpected = formatCode(expected);
    } catch (err) {
        return {
            pass: false,
            message: () => `the expected code is invalid:\n\n${err}`,
        };
    }

    const pass = formattedActual === formattedExpected;
    return {
        pass,
        message: pass
            ? () => 'both blocks of code are equal'
            : () =>
                  `expected and actual code did not match\n${this.utils.diff(formattedExpected, formattedActual)}`,
    };
};

const toOutput: MatcherFunction<[expected: string]> = function (
    actual: any,
    expected: string,
) {
    const typedActual = actual as string;
    const result = cp.spawnSync(typedActual, {
        encoding: 'utf8',
        stdio: 'pipe',
    });

    const output = result.output ? result.output.join(' ').trim() : '';

    const pass = output === expected;
    return {
        pass,
        message: pass
            ? () => 'the actual output matched the expected output'
            : () =>
                  `expected and actual output did not match\n${this.utils.diff(expected, output)}`,
    };
};

expect.extend({
    toEqualCode,
    toOutput,
});

declare module 'expect' {
    interface AsymmetricMatchers {
        /** Checks that a string of code matches another string of code. */
        toEqualCode(expected: string): void;

        /** Checks that the output of a script matches an expected value. */
        toOutput(expected: string): void;
    }
    interface Matchers<R> {
        /** Checks that a string of code matches another string of code. */
        toEqualCode(expected: string): R;

        /** Checks that the output of a script matches an expected value. */
        toOutput(expected: string): R;
    }
}
