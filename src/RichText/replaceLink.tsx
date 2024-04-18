import type {Element} from 'domhandler';
import type {DOMNode} from 'html-react-parser';
import type {
	LinkComponent,
	ImageComponent,
	MacroComponent,
	Replacer,
	RichTextData,
} from '../types';
import type {createReplacer as CreateReplacer} from './createReplacer';


import {domToReact} from 'html-react-parser';
import React from 'react';
import {LINK_ATTR} from '../constants';
import {ErrorBoundary} from './ErrorBoundary';
import {ErrorComponent} from './ErrorComponent';
import {findLinkData} from './findLinkData';


export function replaceLink({
	createReplacer,
	customReplacer,
	data,
	el,
	Image,
	Link,
	Macro,
}: {
	createReplacer: typeof CreateReplacer
	customReplacer?: Replacer
	data: RichTextData
	el: Element
	Image: ImageComponent,
	Link: LinkComponent
	Macro: MacroComponent
}) {
	const {
		attribs: {
			href,
			[LINK_ATTR]: linkRef,
			target,
			title
		},
		children,
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

	const linkData = findLinkData({
		linkRef,
		links,
	});
	if (!linkData) {
		return <ErrorComponent>Unable to find link with ref {linkRef} in links object!</ErrorComponent>
	}

	const {
		content,
		media,
		uri
	} = linkData;

	return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
		<Link
			content={content}
			href={href}
			media={media}
			target={target}
			title={title}
			uri={uri}
		>{domToReact(children as DOMNode[], {
			replace: createReplacer({
				customReplacer,
				data,
				Image,
				Link,
				Macro,
			})
		})}</Link>
	</ErrorBoundary>;
}