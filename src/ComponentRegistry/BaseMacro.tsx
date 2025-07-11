import type {MacroComponentParams} from '../types';

import {Message} from '../Common/Message';
import * as React from 'react';


export function BaseMacro<RestProps = Record<string, unknown>>({
    children,
    meta,
    data,
    common,
    component,
    ...restProps
}: MacroComponentParams<RestProps>) {
    const {name, descriptor} = component;
    const {mode} = meta;

    const componentRegistry = meta.componentRegistry;

    if (!componentRegistry) {
        return (
            <Message mode={mode}>
                {`Can't render macro "${descriptor}". Macro component or componentRegistry should be provided to RichText.`}
            </Message>
        );
    }

    const macroDefinition = componentRegistry.getMacro<MacroComponentParams>(name);
    if (!macroDefinition) {
        return (
            <Message mode={mode}>{`Macro "${descriptor}" is not registered in ComponentRegistry!`}</Message>
        );
    }

    const {View: MacroView} = macroDefinition;
    if (!MacroView) {
        return (
            <Message mode={mode}>{`No View found for macro "${descriptor}" in ComponentRegistry!`}</Message>
        );
    }

    return (
        <MacroView {...restProps} meta={meta} component={component} data={data} common={common}>{children}</MacroView>
    );

}
