import type {DOMNode} from 'html-react-parser';
import type {CreateReplacerParams, ReplacerResult} from '../types';


import {ElementType} from 'domelementtype';

import {IMG_TAG, LINK_TAG, MACRO_TAG} from '../constants';
import {replaceImage} from './replaceImage';
import {replaceLink} from './replaceLink';
import {replaceMacro} from './replaceMacro';


// Replaces "matching" domNodes
export function createReplacer<RestProps = Record<string, unknown>>({
	componentRegistry,
	data,
	Image,
	Link,
	Macro,
	mode,
	replacer,
	...restProps
}: CreateReplacerParams<RestProps>): (domNode: DOMNode) => ReplacerResult {
	const {
		images
	} = data;
	return (domNode: DOMNode): ReplacerResult => {
		if (domNode.type !== ElementType.Tag) {
			return domNode;
		}

		const el = domNode;
		switch (el.tagName) {
			case IMG_TAG:
				return replaceImage({
					...restProps,
					el,
					Image,
					images,
					mode,
				});
			case LINK_TAG:
				return replaceLink({
					...restProps,
					// These should be last, so they can't be overridden:
					createReplacer,
					data,
					el,
					Image,
					Link,
					Macro,
					mode,
					replacer,
				});
			case MACRO_TAG:
				return replaceMacro<RestProps>({
					...restProps,
					// These should be last, so they can't be overridden:
					componentRegistry,
					createReplacer,
					data,
					el,
					Image,
					Link,
					Macro,
					mode,
					replacer,
				});
			default:
				if (replacer) {
					const result = replacer({
						el,
						data,
						mode
					});
					if (result) {
						return result;
					}
				}
		}
		return el;
	};
}
