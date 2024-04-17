import type {DOMNode} from 'html-react-parser';
import type {
	ImageComponent,
	LinkComponent,
	MacroComponent,
	Replacer,
	ReplacerResult,
	RichTextData,
} from '../types';


import {ElementType} from 'domelementtype';

import React from 'react';
import {
	IMG_ATTR,
	IMG_TAG,
	LINK_ATTR,
	LINK_TAG,
	MACRO_ATTR,
	MACRO_TAG,
} from '../constants';
import {ErrorBoundary} from './ErrorBoundary';
import {ErrorComponent} from './ErrorComponent';
import {MediaLink} from './MediaLink';
import {findLinkData} from './findLinkData';
import {childNodesToText} from './childNodesToText';
import {findImageData} from './findImageData';


// Replaces "matching" domNodes
export function createReplacer({
	data,
	customReplacer,
	Image,
	Link,
	Macro,
}: {
	data: RichTextData
	customReplacer?: Replacer
	Image: ImageComponent
	Link: LinkComponent
	Macro: MacroComponent
}): (domNode: DOMNode) => ReplacerResult {
	return (domNode: DOMNode): ReplacerResult => {
		if (domNode.type !== ElementType.Tag) {
			return domNode;
		}

		const el = domNode;
		switch (el.tagName) {
			case IMG_TAG:
				// console.debug('Image attributes:', el.attribs);
				const imageRef = el.attribs[IMG_ATTR];
				// console.debug('Image ref:', ref);
				if (imageRef) {
					const imageData = findImageData({
						images: data.images,
						imageRef
					});
					if (imageData) {
						const {
							attribs: {
								alt,
								sizes,
								src,
								srcset,
								style
							}
						} = el;
						const {
							image,
							style: imageStyle
						} = imageData;
						return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
							<Image
								alt={alt}
								image={image}
								imageStyle={imageStyle}
								sizes={sizes}
								src={src}
								srcset={srcset}
								styleStr={style}
							/></ErrorBoundary>;
					}
				}
				break;
			case LINK_TAG:
				// console.debug('Link attributes:', el.attribs);
				const {
					attribs: {
						href,
						[LINK_ATTR]: linkRef,
						target,
						title
					},
					children,
				} = el;
				// console.debug('Link children:', children);
				// console.debug('Link ref:', ref);

				if (linkRef && href) {
					const linkData = findLinkData({
						linkRef,
						links: data.links,
					});
					if (linkData) {
						const {
							content,
							uri
						} = linkData;
						if (uri.startsWith('media://download/') || uri.startsWith('media://inline/')) {
							return <MediaLink
								children={childNodesToText(children)?.data}
								href={href}
								target={target}
								title={title}
							/>;
						}
						if (!content) {
							console.warn('Link data has no content:', linkData);
							return null;
						}

						return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
							<Link
								children={childNodesToText(children)?.data}
								content={content}
								href={href}
								target={target}
								title={title}
								uri={uri}
							/>
						</ErrorBoundary>;
					}
				} // ref && href
				break;
			case MACRO_TAG:
				const ref = el.attribs[MACRO_ATTR];
				const macroData = ref && data.macros.find((d) => d.ref === ref);
				// console.debug('Macro data:', macroData);
				if (macroData) {
					const {descriptor, name, config} = macroData;
					// console.debug('Macro descriptor:', descriptor, 'name', name, 'config:', config);
					// const [appName, _macroName] = descriptor.split(':');
					// console.debug('Macro appName:', appName, 'macroName', _macroName);
					const props = config[name];
					// console.debug('Macro props:', props);
					return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
						<Macro descriptor={descriptor} config={props}/>
					</ErrorBoundary>;
				}
				break;
			default:
				if (customReplacer) {
					const result = customReplacer(
						domNode,
						data,
					);
					if (result) {
						return result;
					}
				}
				break;
		}
		return el;
	};
}
