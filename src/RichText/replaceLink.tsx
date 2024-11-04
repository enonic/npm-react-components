import type {Element} from 'domhandler';
import type {DOMNode} from 'html-react-parser';
import type {LinkComponent, ImageComponent, MacroComponent, Replacer, RichTextData, LinkComponentParams} from '../types';
import type {createReplacer as CreateReplacer} from './createReplacer';

import * as htmlReactParser from 'html-react-parser';
import {LINK_ATTR} from '../constants';
import {ErrorComponent} from './ErrorComponent';
import {ErrorBoundaryWrapper} from './ErrorBoundary/ErrorBoundaryWrapper';


export function replaceLink<RestProps = Record<string, unknown>>({
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

	const {
		links,
	} = data;
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

	const linkProps = {...rest, content, href, media, target, title, uri} as LinkComponentParams<RestProps>;

	const children = htmlReactParser.domToReact(el.children as DOMNode[], {
		replace: createReplacer({
			...rest,
			// These should be last, so they can't be overridden
			data,
			Image,
			Link,
			Macro,
			replacer
		})
	})

	return <ErrorBoundaryWrapper>
		<Link {...linkProps}>{children}</Link>
	</ErrorBoundaryWrapper>;
}
