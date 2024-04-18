const AND_BELOW = '**'
const DECLARATION_FILES = `*.d.{ts,tsx}`;
const SOURCE_FILES = `*.{ts,tsx}`;
const TEST_EXT = `{spec,test}.{ts,tsx}`;
const TEST_FILES = `*.${TEST_EXT}`;


export default {
	collectCoverageFrom: [
		`src/${AND_BELOW}/${SOURCE_FILES}`,
		`!src/${AND_BELOW}/${DECLARATION_FILES}`
	],
	// coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	testMatch: [
		`<rootDir>/test/${AND_BELOW}/${TEST_FILES}`,
	],
	transform: {
		"^.+\\.(ts|js)x?$": [
			'ts-jest',
			{
				tsconfig: 'test/tsconfig.json'
			}
		]
	}
}
