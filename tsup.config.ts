import type { Options } from 'tsup';


import GlobalsPlugin from 'esbuild-plugin-globals';
import { defineConfig} from 'tsup';


interface MyOptions extends Options {
	d?: string
}


const ENTRY = [
	'src/index.ts',
	'src/nashorn.ts'
];

const external = [];

const noExternal = [
	'@enonic/js-utils',
	'domelementtype',
	// 'html-dom-parser',
	'html-react-parser',
	'react', // For GlobalsPlugin to work react MUST be listed here (if react under dependencies or peerDependencies)
];

const esbuildPlugins = [
	GlobalsPlugin({
		react: 'React',
	}),
];

export default defineConfig((options: MyOptions) => {
	if (Array.isArray(options.format) && options.format[0] === 'cjs') {
		return {
			bundle: true,
			d: 'dist',
			dts: false,
			entry: ENTRY,
			esbuildOptions(options) {
				options.alias = {
					// "html-dom-parser": "./node_modules/html-dom-parser/esm/server/html-to-dom.mjs",
					"html-dom-parser": "./node_modules/html-dom-parser/lib/server/html-to-dom.js",
				}
			},
			esbuildPlugins,
			external,
			minify: false,
			noExternal,
			platform: 'neutral',
			target: 'es5',
			sourcemap: false,
			splitting: true,
			tsconfig: './tsconfig.json',
		};
	} else if (Array.isArray(options.format) && options.format[0] === 'esm') {
		return {
			bundle: true,
			d: 'dist',
			dts: false,
			entry: ENTRY,
			esbuildOptions(options) {
				options.alias = {
					"html-dom-parser": "./node_modules/html-dom-parser/esm/server/html-to-dom.mjs",
					// "html-dom-parser": "./node_modules/html-dom-parser/lib/server/html-to-dom.js",
				}
			},
			esbuildPlugins,
			external,
			minify: false,
			noExternal,
			outExtension() {
				return {
					js: '.mjs'
				}
			},
			platform: 'neutral',
			target: 'es2015',
			splitting: true,
			sourcemap: false,
			tsconfig: './tsconfig.json',
		};
	}
	throw new Error(`Unsupported format:${options.format}!`)
});
