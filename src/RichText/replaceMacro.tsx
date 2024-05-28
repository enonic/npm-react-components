import type {Element} from 'domhandler';
import type {
	MacroComponent,
	MacroComponentParams,
	MacroData
} from '../types';


import React from 'react';
import {MACRO_ATTR} from '../constants';
import {ErrorBoundary} from './ErrorBoundary';
import {ErrorComponent} from './ErrorComponent';


export function replaceMacro<RestProps = Record<string, unknown>>({
	el,
	Macro,
	macros,
	...rest
}: {
	el: Element
	Macro: MacroComponent<RestProps>
	macros?: MacroData[]
}) {
	const ref = el.attribs[MACRO_ATTR];
	if (!ref) {
		return <ErrorComponent>Macro element has no data-macro-ref attribute!</ErrorComponent>
	}

	if (!macros || !macros.length) {
		return <ErrorComponent>Can't replace macro, when there are no macros in the data object!</ErrorComponent>
	}

	const macroData = macros.find((d) => d.ref === ref);
	if (!macroData) {
		return <ErrorComponent>Unable to find macro with ref {ref} in macros object!</ErrorComponent>
	}

	const {descriptor, name, config: configs} = macroData;
	const config = configs[name];

	// config and descriptor should be last, so they can't be overridden
	const props = {...rest, config, descriptor} as MacroComponentParams<RestProps>;

	return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
		<Macro {...props} />
	</ErrorBoundary>;
}
