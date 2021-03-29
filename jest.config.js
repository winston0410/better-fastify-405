const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['./**/*.ts'],
	globals: {
		'ts-jest': {
      diagnostics: {
        ignoreCodes: [2451, 6133, 6192]
      }
		}
	},
	modulePaths: ["node_modules", "."]
}
