const nodeMajorVersion = parseInt(process.version.slice(1, process.version.indexOf('.')), 10)
const testMatch = [''].concat([14, 16].filter(v => v <= nodeMajorVersion))
  .map(v => `**/?(*.)+(spec|test|integrate|accept|system|unit)${v}.[jt]s?(x)`)
testMatch.unshift('!**/*.browser.spec.ts')
export default {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    '<rootDir>/ts/**/*.[jt]s'
  ],
  roots: [
    '<rootDir>/ts',
  ],
  testMatch,
  watchPlugins: [
    'jest-watch-suspend',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' },
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' },
    ],
  ],
}
