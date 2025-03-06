// import type {Element} from 'domhandler';
import type {DOMNode} from 'html-react-parser';
import * as htmlReactParser from 'html-react-parser';
import type {MacroComponentParams, ReplaceMacroParams} from '../types';


import {MACRO_ATTR} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
// import {type createReplacer as CreateReplacer} from './createReplacer';
import {ErrorBoundaryWrapper} from './ErrorBoundary/ErrorBoundaryWrapper';
import {sanitizeGraphqlName} from '../utils/sanitizeGraphqlName';


export function replaceMacro<RestProps = Record<string, unknown>>({
	componentRegistry,
    createReplacer,
    data,
    el,
    Image,
    Link,
    Macro,
	mode,
    replacer,
    ...restProps
}: ReplaceMacroParams<RestProps>) {
    const ref = el.attribs[MACRO_ATTR];
    if (!ref) {
        return <ErrorComponent>Macro element has no data-macro-ref attribute!</ErrorComponent>
    }

    const {
        macros
    } = data;

    if (!macros || !macros.length) {
        return <ErrorComponent>Can't replace macro, when there are no macros in the data object!</ErrorComponent>
    }

    const macroData = macros.find((d) => d.ref === ref);
    if (!macroData) {
        return <ErrorComponent>Unable to find macro with ref {ref} in macros object!</ErrorComponent>
    }

    const {descriptor, name, config: configs} = macroData;
    const config = configs[sanitizeGraphqlName(name)];

    // config and descriptor should be last, so they can't be overridden
    const props = {
		...restProps,
		componentRegistry,
		config,
		descriptor,
		mode
	} as MacroComponentParams<RestProps>;

    const children = htmlReactParser.domToReact(el.children as DOMNode[], {
        replace: createReplacer({
            ...restProps,
			// These should be last, so they can't be overridden:
			componentRegistry,
            data,
            Image,
            Link,
            Macro,
			mode,
            replacer
        })
    });

    if (componentRegistry) {
        const MacroComponentDefinition = componentRegistry.getMacro<MacroComponentParams<RestProps>>(name);
        if (MacroComponentDefinition) {
            const MacroComponent = MacroComponentDefinition.View;
            return (
                <MacroComponent {...props}>{children}</MacroComponent>
            );
        }
    }

    return <ErrorBoundaryWrapper mode={mode}>
        <Macro {...props}>{children}</Macro>
    </ErrorBoundaryWrapper>;
}
