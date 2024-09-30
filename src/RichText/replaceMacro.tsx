import type {Element} from 'domhandler';
import type {MacroComponent, MacroComponentParams, RichTextData, ImageComponent, LinkComponent, Replacer} from '../types';


import React from 'react';
import {MACRO_ATTR} from '../constants';
import {ErrorComponent} from './ErrorComponent';
import {domToReact, type DOMNode} from 'html-react-parser';
import {type createReplacer as CreateReplacer} from './createReplacer';
import {ErrorBoundaryWrapper} from './ErrorBoundary/ErrorBoundaryWrapper';


export function replaceMacro<RestProps = Record<string, unknown>>({
    createReplacer,
    data,
    el,
    Image,
    Link,
    Macro,
    replacer,
    ...rest
}: {
    createReplacer: typeof CreateReplacer
    data: RichTextData
    el: Element
    Image: ImageComponent<RestProps>,
    Link: LinkComponent<RestProps>
    Macro: MacroComponent<RestProps>
    replacer?: Replacer
}) {
    const ref = el.attribs[MACRO_ATTR];
    if (!ref) {
        return <ErrorComponent>Macro element has no data-macro-ref attribute!</ErrorComponent>
    }

    const {
        macros
    } = data;

    if (!macros || !macros.length) {
        return <ErrorComponent>Can't replace macro, when there are no macros in the data object!</ErrorComponent>
    }

    const macroData = macros.find((d) => d.ref === ref);
    if (!macroData) {
        return <ErrorComponent>Unable to find macro with ref {ref} in macros object!</ErrorComponent>
    }

    const {descriptor, name, config: configs} = macroData;
    const config = configs[name];

    // config and descriptor should be last, so they can't be overridden
    const props = {...rest, config, descriptor} as MacroComponentParams<RestProps>;

    const children = domToReact(el.children as DOMNode[], {
        replace: createReplacer({
            ...rest, // These should be last, so they can't be overridden
            data,
            Image,
            Link,
            Macro,
            replacer
        })
    });

    return <ErrorBoundaryWrapper>
        <Macro {...props}>{children}</Macro>
    </ErrorBoundaryWrapper>;
}
