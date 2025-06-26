// import type {PartComponent} from '@enonic-types/core';
import {ProcessedLayout, type ProcessedProps, MetaData, ComponentProps} from '../types';

import * as React from 'react';
import {Message} from '../Common/Message';
import {XP_REQUEST_MODE} from '../constants';

export function BaseLayout({
    component,
    data,
    common,
    meta
}: {
    component: ProcessedLayout,
    data?: ProcessedProps,
    common?: ProcessedProps,
    meta: MetaData
}): JSX.Element | undefined {

    const {descriptor, warning} = component;
    const {mode, componentRegistry} = meta;

    if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
        return (
            <Message mode={mode}>
                {warning}
            </Message>
        );
    }

    if (!warning && !descriptor) {
        // The layout is not initialized yet, so we return nothing for CS to render a placeholder
        return;
    }

    const layoutDefinition = componentRegistry.getLayout<ComponentProps>(descriptor);
    if (!layoutDefinition) {
        return (
            <Message mode={mode}>{`Layout descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
        );
    }

    const {View: LayoutView} = layoutDefinition;
    if (!LayoutView) {
        return (
            <Message mode={mode}>
                {`No View found for layout descriptor:${descriptor} in ComponentRegistry!`}
            </Message>
        );
    }

    return (
        <LayoutView component={component} data={data} common={common} meta={meta}/>
    );
}
