import type {Options} from 'tsup';
import {defineConfig} from 'tsup';
import fg from 'fast-glob';
import {basename} from 'path';

const clientEntries = fg.sync(['src/**/*.client.ts', 'src/**/*.client.tsx'], {
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
        outExtension({format}) {
            return format === 'esm' ? {js: '.mjs'} : {js: '.cjs'};
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
    return [{
        ...commonConfig(options),
        entry: [
            'src/index.ts',
            'src/nashorn.ts'
        ],
        esbuildPlugins: [
            {
                name: 'rewrite-client-imports',
                setup(build) {
                    // Match client files with extensions `.client.ts` or `.client.tsx`
                    build.onResolve({filter: /\.client(\.tsx?)?$/}, (args) => ({
                        path: `./${basename(args.path)}`,   // client components will always be bundled at the root of the dist folder
                        external: true // Treat as external to avoid server-side inclusion
                    }));
                }
            }
        ]
    }, {
        ...commonConfig(options),
        entry: clientEntries
    }];
});
