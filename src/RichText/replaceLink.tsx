import type {DOMNode} from 'html-react-parser';
import * as htmlReactParser from 'html-react-parser';
import type {LinkComponentParams, ReplaceMacroImageLinkParams} from '../types';
import {LINK_ATTR} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
import {ErrorBoundaryWrapper} from './ErrorBoundary/ErrorBoundaryWrapper';


export function replaceLink<RestProps = Record<string, unknown>>({
    createReplacer,
    data,
    el,
    Image,
    Link,
    Macro,
    meta,
    replacer,
    component,
    common,
    ...restProps
}: ReplaceMacroImageLinkParams<RestProps>) {

    const {
        attribs: {
            href,
            [LINK_ATTR]: linkRef,
            target,
            title
        }
    } = el;

    if (!linkRef) { // non-content links like mailto and external links.
        return;
    }

    if (!href) {
        return <ErrorComponent>Link element has no href attribute!</ErrorComponent>
    }

    const {links} = data;
    if (!links || !links.length) {
        return <ErrorComponent>Can't replace link, when there are no links in the data object!</ErrorComponent>
    }

    const linkData = links.find(data => data.ref === linkRef);
    if (!linkData) {
        return <ErrorComponent>Unable to find link with ref {linkRef} in links object!</ErrorComponent>
    }

    const {
        content,
        media,
        uri
    } = linkData;

    const linkProps = {
        ...restProps,
        content,
        href,
        media,
        target,
        title,
        uri
    } as LinkComponentParams<RestProps>;

    const children = htmlReactParser.domToReact(el.children as DOMNode[], {
        replace: createReplacer({
            ...restProps,
            // These should be last, so they can't be overridden
            data,
            Image,
            Link,
            Macro,
            meta,
            common,
            component,
            replacer
        })
    })

    const {mode} = meta;
    return <ErrorBoundaryWrapper mode={mode}>
        <Link {...linkProps}>{children}</Link>
    </ErrorBoundaryWrapper>;
}
