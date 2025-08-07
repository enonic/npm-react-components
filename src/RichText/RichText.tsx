import {RichTextParams} from '../types'


// Converts an HTML string to one or more React elements
import parser from 'html-react-parser/lib/index';
import type {JSX} from 'react';

// Replaces "matching" domNodes
import {createReplacer} from './createReplacer';

import {Image as ImageFallback} from './Image';
import {Link as LinkFallback} from './Link';
import {BaseMacro} from '../ComponentRegistry/BaseMacro';


export function RichText<RestProps = Record<string, unknown>>({
    tag,
    className,
    Image = ImageFallback,
    Link = LinkFallback,
    Macro = BaseMacro,
    data,
    ...restProps
}: RichTextParams<RestProps>) {
    // console.info('RichText', {data, Macro, tag, ...restProps});
    const CustomTag = tag as keyof JSX.IntrinsicElements || 'section';
    return <CustomTag className={className}>
        {
            data.processedHtml
                /* try parser.default.default first because import is wrapped with __toesm() in cjs files
                 * for node compatibility, which adds default export resulting in parser.default.default */
                ? (((parser as any).default as typeof parser) || parser)(data.processedHtml, {
                    replace: createReplacer<RestProps>({
                        ...restProps,
                        // These should be last, so they can't be overridden:
                        data,
                        Image,
                        Link,
                        Macro
                    })
                })
                : ''
        }
    </CustomTag>;
}
