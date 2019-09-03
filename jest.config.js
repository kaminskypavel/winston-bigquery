module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|jsx?)$',
	testPathIgnorePatterns: ['/node_modules/', '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$'],
	collectCoverage: false,
	coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx??)$'],
	verbose: true,
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
