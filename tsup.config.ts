import type {Options} from 'tsup';
import {defineConfig} from 'tsup';
import fg from 'fast-glob';
import {basename} from 'path';

const clientEntries = fg.sync(['src/**/*.client.{ts,tsx}'], {
    absolute: true, // Returns full paths
    onlyFiles: true, // Ensures only files are returned
    unique: true // Ensures unique entries
});

const external = [
    'react',
    'react-dom'
];

const noExternal = [
    '@enonic/js-utils', // We only use toStr which is so small, might as well just bundle it.

    // Maybe these could remain dependencies in package.json,
    // but currently that seems to cause runtime errors with starter-react4xp.
    'clsx',
    'domelementtype'
];

function commonConfig(options: Options): Options {
    const isProd = options.env?.BUILD_ENV === 'prod';
    return {
        outDir: './dist',
        external,
        noExternal,
        esbuildOptions(options, {format}) {
            let isEsm = format === 'esm';
            options.alias = {
                "html-dom-parser": isEsm ?
                    "./node_modules/html-dom-parser/esm/server/html-to-dom.mjs" :
                    "./node_modules/html-dom-parser/lib/server/html-to-dom.js"
            }
            options.outExtension = isEsm ? {'.js': '.mjs'} : {'.js': '.cjs'};
        },
        dts: true,
        platform: 'neutral',
        target: 'es2015',
        minify: isProd,
        sourcemap: !isProd,
        bundle: true,
        clean: true,
        splitting: true,
        tsconfig: './tsconfig.json'
    }
}

export default defineConfig((options: Options) => {
    const common = commonConfig(options);
    return [{
        ...common,
        entry: [
            'src/index.ts',
            'src/nashorn.ts'
        ],
        esbuildPlugins: [
            {
                name: 'rewrite-client-imports',
                setup(build) {
                    const ext = build.initialOptions.outExtension?.['.js'] || '';
                    // Treat .client.ts(x) components as external to keep in separate files and guarantee 'use client'
                    build.onResolve({filter: /\.client(\.tsx?)?$/}, (args) => ({
                        path: `./${basename(args.path)}${ext}`,
                        external: true
                    }));
                }
            }
        ]
    }, {
        ...common,
        entry: clientEntries
    }];
});
