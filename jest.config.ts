import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'ts'],
  passWithNoTests: true,
  preset: 'ts-jest/presets/js-with-ts-esm',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'node',
  testRegex: '.+\\.test\\.ts$',
};

export default config;
