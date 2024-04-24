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

import {
	IMG_TAG,
	LINK_TAG,
	MACRO_TAG,
} from '../constants';
import {replaceImage} from './replaceImage';
import {replaceLink} from './replaceLink';
import {replaceMacro} from './replaceMacro';


// Replaces "matching" domNodes
export function createReplacer({
	data,
	Image,
	Link,
	Macro,
	replacer,
}: {
	data: RichTextData
	Image: ImageComponent
	Link: LinkComponent
	Macro: MacroComponent
	replacer?: Replacer
}): (domNode: DOMNode) => ReplacerResult {
	const {
		images,
		macros
	} = data;
	return (domNode: DOMNode): ReplacerResult => {
		if (domNode.type !== ElementType.Tag) {
			return domNode;
		}

		const el = domNode;
		switch (el.tagName) {
			case IMG_TAG:
				return replaceImage({
					el,
					Image,
					images
				});
			case LINK_TAG:
				return replaceLink({
					createReplacer,
					data,
					el,
					Image,
					Link,
					Macro,
					replacer,
				});
			case MACRO_TAG:
				return replaceMacro({
					el,
					Macro,
					macros,
				});
			default:
				if (replacer) {
					const result = replacer(
						el,
						data,
					);
					if (result) {
						return result;
					}
				}
		}
		return el;
	};
}
