import type {PartData, ComponentProps} from '../types';

// import { toStr } from '@enonic/js-utils/value/toStr';
import type {JSX} from 'react';
import {Message} from '../Common/Message';

export function BasePart({
    component,
    data,
    common,
    meta
}: ComponentProps<PartData>): JSX.Element | undefined {

    const {descriptor} = component;
    const {mode, componentRegistry} = meta;

    if (!descriptor) {
        // The part is not initialized yet, so we return nothing for CS to render a placeholder
        return;
    }

    const partDefinition = componentRegistry.getPart<ComponentProps>(descriptor);

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

    return (
        <PartView component={component} data={data} common={common} meta={meta}/>
    );
}
