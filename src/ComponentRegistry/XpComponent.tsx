import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from '../ComponentRegistry';
import type {
	RenderableComponent,
	XpTextProps
} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';

import {XP_COMPONENT_TYPE} from '../constants';

import {XpBaseLayout} from './XpBaseLayout';
import {XpBasePage} from './XpBasePage';
import {XpBasePart} from './XpBasePart';
import {XpFallback} from './XpFallback';
import {XpText} from './XpText';


export function XpComponent({
	component,
	componentRegistry
}: {
	component: RenderableComponent
	componentRegistry?: ComponentRegistry
}) {
	// console.debug('XpComponent component:', toStr(component));

	if (!componentRegistry) {
		console.warn('XpComponent componentRegistry missing! with component:', toStr(component));
		return (
			<XpFallback component={component as Component}/>
		);
	}

	const {type} = component;
	if (!type) {
		console.error('XpComponent component missing type:', toStr(component));
		return (
			<XpFallback component={component}/>
		);
	}
	// console.info('XpComponent type:', type);

	switch (type) {
		case XP_COMPONENT_TYPE.PART:
			return (
				<XpBasePart
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case XP_COMPONENT_TYPE.LAYOUT:
			return (
				<XpBaseLayout
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case XP_COMPONENT_TYPE.PAGE:
			return (
				<XpBasePage
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case XP_COMPONENT_TYPE.TEXT: {
			// console.info('XpComponent text component:', toStr(component));

			const {props} = component;
			if (!props) {
				throw new Error(`Text component missing props: ${toStr(component)}`);
			}
			// console.info('XpComponent text component props:', toStr(props));
			const textProps = props as XpTextProps;
			textProps.componentRegistry = componentRegistry;

			return (
				<XpText {...textProps}/>
			);
		}
	} // switch

	console.error(`Unknown component type: ${type}`);
	return (
		<XpFallback component={component as Component}/>
	);

} // XpComponent
