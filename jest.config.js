const isCI = require('is-ci')

module.exports = {
  'collectCoverageFrom': [
    '<rootDir>/ts/**/*.[jt]s',
    '!<rootDir>/ts/bin.[jt]s'
  ],
  'reporters': [
    'default',
    isCI ?
      ['jest-junit', { 'output': '.reports/junit/js-test-results.xml' }] :
      'jest-progress-tracker',
  ],
  'roots': [
    '<rootDir>/ts',
  ],
  'testEnvironment': 'node',
  'testMatch': [
    '**/?(*.)+(spec|test|integrate|accept|system|unit).[jt]s?(x)',
    '!**/*.browser.spec.ts'
  ],
  'watchPlugins': [
    'jest-watch-suspend',
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    [
      'jest-watch-toggle-config', { 'setting': 'verbose' },
    ],
    [
      'jest-watch-toggle-config', { 'setting': 'collectCoverage' },
    ],
  ]
}
