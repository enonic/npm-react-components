import type {ProcessedText, ProcessedProps, MetaData} from '../types';

import {toStr} from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import {Message} from '../Common/Message';
import {XpFallback} from './XpFallback';
import {XP_REQUEST_MODE} from '../constants';
import {RichText} from '../RichText/RichText';
import {TextBaseProps} from '../types/TextBaseProps';

export const BaseText = ({
    component,
    data,
    common,
    meta
}: {
    component: ProcessedText,
    common?: ProcessedProps,
    data?: ProcessedProps,
    meta: MetaData
}): JSX.Element => {

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

    const textProps = (data as unknown) as TextBaseProps;

    return <RichText
        tag={textProps.as}
        componentRegistry={componentRegistry}
        data={textProps.data}
        mode={mode}
    />;
}
