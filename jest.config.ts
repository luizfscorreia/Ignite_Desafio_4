export default {
    bail: true,
    coverageProvider: "v8",
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.spec.ts"],
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],
    coverageDirectory: "coverage",
    coverageReporters: ["text-summary", "lcov"],
};
