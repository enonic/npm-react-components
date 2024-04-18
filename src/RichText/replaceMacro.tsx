import type {Element} from 'domhandler';
import type {
	MacroComponent,
	MacroData
} from '../types';


import React from 'react';
import {MACRO_ATTR} from '../constants';
import {ErrorBoundary} from './ErrorBoundary';
import {ErrorComponent} from './ErrorComponent';


export function replaceMacro({
	el,
	Macro,
	macros,
}: {
	el: Element
	Macro: MacroComponent
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

	const {descriptor, name, config} = macroData;
	const props = config[name];
	return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
		<Macro descriptor={descriptor} config={props}/>
	</ErrorBoundary>;
}
