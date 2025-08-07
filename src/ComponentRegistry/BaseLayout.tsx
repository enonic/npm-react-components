import {LayoutData, ComponentProps} from '../types';

import type {JSX} from 'react';
import {Message} from '../Common/Message';

export function BaseLayout({
    component,
    data,
    common,
    meta
}: ComponentProps<LayoutData>): JSX.Element | undefined {

    const {descriptor} = component;
    const {mode, componentRegistry} = meta;

    if (!descriptor) {
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
