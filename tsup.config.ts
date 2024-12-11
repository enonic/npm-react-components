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
	'@enonic/js-utils', // We only use toStr which is so small, might as well just bundle it.

	// Maybe these could remain dependencies in package.json,
	// but currently that seems to cause runtime errors with starter-react4xp.
	'clsx',
	'domelementtype',

	// The entities node module contains Uint16Array which fails in Nashorn.
	// html-react-parser has multiple layers of dependencies that ends up dragging in entities.
	// html-react-parser -> html-dom-parser -> htmlparser2 -> domutils -> dom-serializer -> entities
	// To avoid the problem we bundle the server variant of html-dom-parser which does not depend on entities.
	// As such is should be kept a devDependency in the package.json and be listed as an external here:
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
