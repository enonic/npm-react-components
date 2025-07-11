// import type {Element} from 'domhandler';
import type {DOMNode} from 'html-react-parser';
import * as htmlReactParser from 'html-react-parser';
import type {MacroComponentParams, ReplaceMacroImageLinkParams, MacroComponentData} from '../types';

import {MACRO_ATTR} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
// import {type createReplacer as CreateReplacer} from './createReplacer';
import {ErrorBoundaryWrapper} from './ErrorBoundary/ErrorBoundaryWrapper';


export function replaceMacro<RestProps = Record<string, unknown>>(props: ReplaceMacroImageLinkParams<RestProps>) {
    const {
        createReplacer,
        el,
        ...createReplacerProps
    } = props;

    const ref = el.attribs[MACRO_ATTR];
    if (!ref) {
        return <ErrorComponent>Macro element has no data-macro-ref attribute!</ErrorComponent>
    }

    const {
        data: generalData,
        common,
        component: generalComponent,
        meta,
        Macro,
        replacer,
        Link,
        Image,
        ...restProps
    } = createReplacerProps;

    let macros = generalData.macroComponents || generalData.macros;

    if (!macros || !macros.length) {
        return <ErrorComponent>Can't replace macro, when there are no macros in the data object!</ErrorComponent>
    }

    const macroData = macros.find((d) => {
        if ('component' in d) {
            return d.component.ref === ref
        } else {
            return d.ref === ref
        }
    });
    if (!macroData) {
        return <ErrorComponent>Unable to find macro with ref {ref} in macros object!</ErrorComponent>
    }

    let component: MacroComponentData, data: Record<string, unknown> | undefined;
    if ('component' in macroData) {
        component = macroData.component;
        data = macroData.data;
    } else {
        component = {
            ref: macroData.ref,
            descriptor: macroData.descriptor,
            name: macroData.name,
            type: 'macro'
        };
        // data is undefined for legacy macros
    }

    // config and descriptor should be last, so they can't be overridden
    const macroProps = {
        ...restProps,
        component,
        common,
        meta,
        data
    } as MacroComponentParams<RestProps>;

    const children = htmlReactParser.domToReact(el.children as DOMNode[], {
        replace: createReplacer(createReplacerProps)
    });

    const {componentRegistry, mode} = meta;
    if (componentRegistry) {
        const MacroComponentDefinition = componentRegistry.getMacro<MacroComponentParams<RestProps>>(component.descriptor);
        if (MacroComponentDefinition) {
            const MacroComponent = MacroComponentDefinition.View;
            return (
                <MacroComponent {...macroProps}>{children}</MacroComponent>
            );
        }
    }

    return <ErrorBoundaryWrapper mode={mode}>
        <Macro {...macroProps}>{children}</Macro>
    </ErrorBoundaryWrapper>;
}
