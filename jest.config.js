module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: ['**/?(*.)+(spec|test).js'],
    collectCoverage: true,
    collectCoverageFrom: [
      'controllers/**/*.js',
      'middleware/**/*.js',
      'models/**/*.js',
      'routes/**/*.js',
      'utils/**/*.js',
      '!**/node_modules/**',
      '!**/vendor/**'
    ],
    coverageDirectory: '<rootDir>/coverage',
  };
  