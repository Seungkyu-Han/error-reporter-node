import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    testMatch: ['**/?(*.)+(spec|test).ts'],

    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.module.ts',
        '!src/main.ts',
        '!**/*.d.ts',
    ],

    coverageDirectory: 'coverage',

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },

    coverageReporters: ['text', 'text-summary'],

    transform: {
        '^.+\\.ts$': 'ts-jest',
    },

    moduleFileExtensions: ['ts', 'js', 'json'],

    verbose: true,
};

export default config;
