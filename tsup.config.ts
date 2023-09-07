import type { Options } from 'tsup';


import { globSync } from 'glob';
import { defineConfig} from 'tsup';


interface MyOptions extends Options {
	d?: string
}


const GLOB_EXTENSIONS = '{ts,tsx}';
const TS_FILES = globSync(`./src/**/*.${GLOB_EXTENSIONS}`, {
	absolute: false,
	ignore: []
}).map(dir => dir.replace(/\\/g,'/'));


export default defineConfig((options: MyOptions) => {
	if (options.d === 'dist/cjs') {
		return {
			entry: TS_FILES,
			format: 'cjs',
			minify: false,
			platform: 'neutral',
			target: 'es5',
			sourcemap: false,
		};
	} else if (options.d === 'dist/esm') {
		return {
			entry: TS_FILES,
			format: 'esm',
			minify: false,
			outExtension() {
				return {
					js: '.mjs'
				}
			},
			platform: 'neutral',
			target: 'es2015',
			splitting: false, // avoid chunk files
			sourcemap: false,
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
});
