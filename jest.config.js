module.exports = {
    verbose: false,
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testPathIgnorePatterns: [
        'node_modules',
        'dist',
    ],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/src/helpers/pdfkit/',
    ],
};
