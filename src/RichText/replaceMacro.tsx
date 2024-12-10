// import type {Element} from 'domhandler';
import type {DOMNode} from 'html-react-parser';
import type {MacroComponentParams, ReplaceMacroParams} from '../types';


import {MACRO_ATTR} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
import * as htmlReactParser from 'html-react-parser';
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
    replacer,
    ...rest
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

	if (componentRegistry) {
		const MacroComponentDefinition = componentRegistry.getMacro(name);
		if (MacroComponentDefinition) {
			const MacroComponent = MacroComponentDefinition.View;
			return (
				<MacroComponent {...config}/>
			);
		}
	}

    // config and descriptor should be last, so they can't be overridden
    const props = {...rest, componentRegistry, config, descriptor} as MacroComponentParams<RestProps>;

    const children = htmlReactParser.domToReact(el.children as DOMNode[], {
        replace: createReplacer({
            ...rest, // These should be last, so they can't be overridden
			componentRegistry,
            data,
            Image,
            Link,
            Macro,
            replacer
        })
    });

    return <ErrorBoundaryWrapper>
        <Macro {...props}>{children}</Macro>
    </ErrorBoundaryWrapper>;
}
