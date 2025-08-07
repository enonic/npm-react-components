import type {Options} from 'tsup';
import {defineConfig} from 'tsup';

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

const commonConfig = (isProd?: boolean): Options => {
    return {
        entry: ENTRY,
        external,
        noExternal,
        outDir: 'dist',
        platform: 'neutral',
        minify: isProd,
        sourcemap: !isProd,
        dts: true,
        bundle: true,
        clean: false,
        splitting: true,
        tsconfig: './tsconfig.json'
    }
}

export default defineConfig((globalOptions: Options) => {
    const isProd = globalOptions.env?.BUILD_ENV === 'prod';
    console.log(`\nBuilding for environment: ${isProd ? 'production' : 'development'}\n\n`);
    return [{
        ...commonConfig(isProd),
        format: 'cjs',
        target: 'es5'
    }, {
        ...commonConfig(isProd),
        outExtension: () => ({
            js: '.mjs'
        }),
        format: 'esm',
        target: 'es2015'
    }] as Options[];
});
