import {PageData, ComponentProps} from '../types';

import * as React from 'react';
import {Message} from '../Common/Message';

export function BasePage({
    component,
    data,
    common,
    meta
}: ComponentProps<PageData>): JSX.Element | undefined {
    const {descriptor} = component;

    const {mode, componentRegistry} = meta;

    if (!descriptor) {
        // The page is not initialized yet, so we return nothing for CS to render a placeholder
        return;
    }

    const pageDefinition = componentRegistry.getPage<ComponentProps>(descriptor);
    if (!pageDefinition) {
        return (
            <Message mode={mode}>{`Page descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
        );
    }

    const {View: PageView} = pageDefinition;
    if (!PageView) {
        return (
            <Message mode={mode}>{`No View found for page descriptor:${descriptor} in ComponentRegistry!`}</Message>
        );
    }

    return (
        <PageView component={component} data={data} common={common} meta={meta}/>
    );
}
