import type {DOMNode} from 'html-react-parser';
import type {CreateReplacerParams, ReplacerResult} from '../types';


import {ElementType} from 'domelementtype';

import {IMG_TAG, LINK_TAG, MACRO_TAG} from '../constants';
import {replaceImage} from './replaceImage';
import {replaceLink} from './replaceLink';
import {replaceMacro} from './replaceMacro';
import {ReplacerParams} from '../types/RichText';


// Replaces "matching" domNodes
export function createReplacer<RestProps = Record<string, unknown>>(props: CreateReplacerParams<RestProps>): (domNode: DOMNode) => ReplacerResult {

    return (domNode: DOMNode): ReplacerResult => {
        if (domNode.type !== ElementType.Tag) {
            return domNode;
        }

        const el = domNode;
        switch (el.tagName) {
            case IMG_TAG:
                return replaceImage<RestProps>({
                    ...props,
                    el,
                    createReplacer
                });
            case LINK_TAG:
                return replaceLink<RestProps>({
                    ...props,
                    el,
                    createReplacer
                });
            case MACRO_TAG:
                return replaceMacro<RestProps>({
                    ...props,
                    el,
                    createReplacer
                });
            default:
                const {replacer, Link, Macro, Image, ...restProps} = props;
                if (replacer) {
                    const result = replacer({
                        ...restProps,
                        el
                    } as ReplacerParams<RestProps>);
                    if (result) {
                        return result;
                    }
                }
        }
        return el;
    };
}
