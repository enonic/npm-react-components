import type {
	imageUrl as libPortalImageUrl,
	pageUrl as libPortalPageUrl
} from '@enonic-types/lib-portal';
import type {DOMNode} from 'html-react-parser';
import type {
	Replacer,
	ReplacerResult,
	RichTextData
} from '../types';

import {ElementType} from 'domelementtype';
import React from 'react';
import {parse} from 'uri-js';
import {
	IMG_ATTR,
	IMG_TAG,
	LINK_ATTR,
	LINK_TAG,
	// MACRO_ATTR,
	// MACRO_TAG,
} from '../constants';
import {processSrcSet} from './processSrcSet'
// import {Link} from './Link';
import {findLinkData} from './findLinkData';
import {findImageData} from './findImageData';
import {parseImageUrl} from './parseImageUrl';


const DEBUG = false;


// Replaces "matching" domNodes
export function createReplacer({
	data,
	// meta,
	// renderMacroInEditMode = true,
	customReplacer,
	imageUrlFn,
	pageUrlFn
}: {
	data: RichTextData
	// meta: MetaData
	// renderMacroInEditMode?: boolean
	customReplacer?: Replacer
	imageUrlFn: typeof libPortalImageUrl
	pageUrlFn: typeof libPortalPageUrl
}): (domNode: DOMNode) => ReplacerResult {
	// eslint-disable-next-line react/display-name
	return (domNode: DOMNode): ReplacerResult => {
		if (domNode.type !== ElementType.Tag) {
			return domNode;
		}

		const el = domNode;
		let ref: string;
		switch (el.tagName) {
			case IMG_TAG:
				DEBUG && console.debug('Image attributes:', el.attribs);
				ref = el.attribs[IMG_ATTR];
				// console.debug('Image ref:', ref);
				if (ref) {
					const imageData = findImageData({
						images: data.images,
						ref
					});
					if (imageData) {
						// const imageId = imageData.image._id;
						const src = el.attribs['src'];
						// console.debug('Image src:', src);
						const {
							// admin,
							background,
							// branch,
							filter,
							// filename,
							id,
							// mode,
							// project,
							// host,
							params,
							// port,
							quality,
							scale,
							// scheme,
							type,
							// versionKey
						} = parseImageUrl({imageUrl: src})
						if (src) {
							el.attribs['src'] = imageUrlFn({
								background,
								id,
								filter,
								// format,
								params,
								quality,
								scale,
								type,
							});
						}

						const srcset = el.attribs['srcset'];
						if (srcset) {
							el.attribs['srcset'] = processSrcSet(//{
								// pageUrl, // TODO
								srcset
							// }
						);
						}
					}
				}
				break;
			case LINK_TAG:
				console.debug('Link attributes:', el.attribs);
				ref = el.attribs[LINK_ATTR];
				// console.debug('Link ref:', ref);
				const href = el.attribs['href'];

				if (ref && href) {
					const linkData = findLinkData({
						links: data.links,
						ref
					});
					if (linkData) {
						// const idFromUri = linkData.uri.split('?')[0].split('/').pop() as string;
						const uriObj = parse(href);
						const urlQueryParams = {};
						uriObj.query?.split('&').forEach((pair) => {
							const [key, value] = pair.split('=');
							urlQueryParams[key] = value;
							// TODO handle multiple values
						});
						const url = `${pageUrlFn({
							// id: idFromUri,
							id: linkData.content._id,
							params: urlQueryParams
						})}${uriObj.fragment ? `#${uriObj.fragment}` : ''}`;
						el.attribs['href'] = url;
						// const textChild = el.children?.find(c => c.type === ElementType.Text);
						// const text = textChild ? (textChild as unknown as Text).data : undefined;
						// return <Link href={url} text={text}/>;
					}
				} // ref && href
				break;
			// case MACRO_TAG:
			//     ref = el.attribs[MACRO_ATTR];
			//     const macroData = ref && allData.macros.find((d) => d.ref === ref);
			//     if (macroData) {
			//         return <BaseMacro data={macroData} meta={meta} renderInEditMode={renderMacroInEditMode}/>;
			//     }
			//     break;
			default:
				if (customReplacer) {
					const result = customReplacer(
						domNode,
						data,
						// meta,
						// renderMacroInEditMode
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
