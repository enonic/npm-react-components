import type {Options} from 'tsup';
import {defineConfig} from 'tsup';

interface MyOptions extends Options {
    d?: string
}

const ENTRY = [
    'src/index.ts',
    'src/nashorn.ts',
    'src/utils/initPublicPath.ts'
];

const external = [
    'react',
    "react-dom",
    'react-dom/server',
    'html-react-parser'
];

const noExternal = [
    '@enonic/js-utils', // We only use toStr which is so small, might as well just bundle it.

    // Maybe these could remain dependencies in package.json,
    // but currently that seems to cause runtime errors with starter-react4xp.
    'clsx',
    'domelementtype'
];

export default defineConfig((options: MyOptions) => {
    if (Array.isArray(options.format) && options.format[0] === 'cjs') {
        return {
            bundle: true,
            d: 'dist',
            dts: false,
            entry: ENTRY,
            minify: false,
            external,
            noExternal,
            platform: 'neutral',
            target: 'es5',
            sourcemap: false,
            splitting: true,
            tsconfig: './tsconfig.json'
        };
    } else if (Array.isArray(options.format) && options.format[0] === 'esm') {
        return {
            bundle: true,
            d: 'dist',
            dts: false,
            entry: ENTRY,
            minify: false,
            external,
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
            tsconfig: './tsconfig.json'
        };
    }
    throw new Error(`Unsupported format:${options.format}!`)
});
