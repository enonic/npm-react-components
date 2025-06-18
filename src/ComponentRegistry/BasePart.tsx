import type {ComponentRegistry, ProcessedPart} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import {Message} from '../Common/Message';
import {XP_REQUEST_MODE} from '../constants';

export function BasePart({
    data,
    componentRegistry
}: {
    data: ProcessedPart
    componentRegistry: ComponentRegistry
}): JSX.Element | undefined {

    const {
        descriptor,
        mode,
        props,
        warning
    } = data;

    if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
        return (
            <Message mode={mode}>
                {warning}
            </Message>
        );
    }

    if (!warning && !descriptor) {
        // The part is not initialized yet, so we return nothing for CS to render a placeholder
        return;
    }

    const partDefinition = componentRegistry.getPart(descriptor);

    if (!partDefinition) {
        return (
            <Message {...{
                children: `Part descriptor:${descriptor} not registered in ComponentRegistry!`,
                mode
            }}/>
        );
    }

    const {View: PartView} = partDefinition;
    if (!PartView) {
        return (
            <Message {...{
                children: `No View found for part descriptor:${descriptor} in ComponentRegistry!`,
                mode
            }}/>
        );
    }

    if (!props) {
        return (
            <Message {...{
                children: `Part component missing props: ${descriptor}!`,
                mode
            }}/>
        );
    }

    return (
        <PartView {...props}/>
    );
}
