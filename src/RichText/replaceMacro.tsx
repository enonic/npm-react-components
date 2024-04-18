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
	if (!macros || !macros.length) {
		return <ErrorComponent>Can't replace macro, when there are no macros in the data object!</ErrorComponent>
	}
	const ref = el.attribs[MACRO_ATTR];
	const macroData = ref && macros.find((d) => d.ref === ref);
	if (macroData) {
		const {descriptor, name, config} = macroData;
		const props = config[name];
		return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
			<Macro descriptor={descriptor} config={props}/>
		</ErrorBoundary>;
	}
}
