import type {TextData, ComponentProps, RichTextData} from '../types';

import {toStr} from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import {Message} from '../Common/Message';
import {XpFallback} from './XpFallback';
import {XP_REQUEST_MODE} from '../constants';
import {RichText} from '../RichText/RichText';
import type {LiteralUnion} from '@enonic-types/core';
import type {ClassValue} from 'clsx';

interface BaseTextProps extends Record<string, unknown> {
    as?: LiteralUnion<keyof JSX.IntrinsicElements>;
    className?: ClassValue;
    data: RichTextData;
}

export const BaseText = ({
    component,
    data,
    common,
    meta
}: ComponentProps<TextData>): JSX.Element => {

    const {mode, componentRegistry} = meta;

    const dataPortalComponentType = mode === XP_REQUEST_MODE.EDIT ? 'text' : undefined;

    if (!data) {
        if (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN) {
            return (
                <Message {...{
                    'data-portal-component-type': dataPortalComponentType,
                    mode
                }}>Text component missing props: {toStr(component)}</Message>
            );
        }
        console.warn('BaseText: Text component missing props:', toStr(component));
        return <XpFallback data={component}/>
    }

    const {as, data: textData} = data as BaseTextProps;

    return <RichText
        tag={as}
        componentRegistry={componentRegistry}
        data={textData}
        mode={mode}
    />;
}
