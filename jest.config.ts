module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**',
        '!<rootDir>/src/domain/**',
        '!<rootDir>/src/data/**',
        '!<rootDir>/src/presentation/**',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
        '.+\\.ts$': 'ts-jest',
    },
}
