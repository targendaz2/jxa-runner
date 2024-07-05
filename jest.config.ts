import { JestConfigWithTsJest } from 'ts-jest';

type Reporter = Required<JestConfigWithTsJest>['reporters'][number];

const reporters: Reporter[] =
  process.env.GITHUB_ACTIONS === 'true'
    ? [['github-actions', { silent: false }], 'summary']
    : ['default'];

const config: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  passWithNoTests: true,
  preset: 'ts-jest/presets/default-esm',
  reporters,
  setupFilesAfterEnv: ['jest-extended-code', 'jest-extended-fs'],
  testEnvironment: 'node',
  testRegex: '.+\\.test\\.ts$',
};

export default config;
