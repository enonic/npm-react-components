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
	if (Array.isArray(options.format) && options.format[0] === 'cjs') {
		return {
			d: 'dist',
			dts: false,
			entry: TS_FILES,
			minify: false,
			platform: 'neutral',
			target: 'es5',
			sourcemap: false,
		};
	} else if (Array.isArray(options.format) && options.format[0] === 'esm') {
		return {
			d: 'dist',
			dts: false,
			entry: TS_FILES,
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
	throw new Error(`Unsupported format:${options.format}!`)
});
