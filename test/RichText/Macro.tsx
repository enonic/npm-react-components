import type {MacroComponent} from '../../src/types';
import React from 'react';
import {Success} from './Success';


export const Macro: MacroComponent = ({
	config,
	descriptor
}) => {
	if (descriptor === 'com.enonic.app.panelmacros:success') {
		return <Success {...config} />;
	}
	throw new Error(`Macro not found: ${descriptor}`);
}
