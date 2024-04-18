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
					customReplacer,
					data,
					el,
					Image,
					Link,
					Macro,
				});
			case MACRO_TAG:
				return replaceMacro({
					el,
					Macro,
					macros,
				});
			default:
				if (customReplacer) {
					const result = customReplacer(
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
