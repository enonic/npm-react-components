import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from '../ComponentRegistry';
import type {RenderableComponent} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';

import {RENDERABLE_COMPONENT_TYPE} from '../constants';
import {ErrorComponent} from '../ErrorComponent';
import {Warning} from '../Warning';
import {XpBaseLayout} from './XpBaseLayout';
import {XpBasePage} from './XpBasePage';
import {XpBasePart} from './XpBasePart';
import {XpBaseText} from './XpBaseText';
import {XpContentType} from './XpContentType';
import {XpFallback} from './XpFallback';


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

	const {
		// mode,
		type
	} = component;
	if (!type) {
		console.error('XpComponent component missing type:', toStr(component));
		return (
			<XpFallback component={component}/>
		);
	}
	// console.info('XpComponent type:', type);

	switch (type) {
		case RENDERABLE_COMPONENT_TYPE.PART:
			return (
				<XpBasePart
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.LAYOUT:
			return (
				<XpBaseLayout
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.PAGE:
			return (
				<XpBasePage
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.CONTENT_TYPE:
			return (
				<XpContentType
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.TEXT: {
			return (
				<XpBaseText
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		}
		case RENDERABLE_COMPONENT_TYPE.ERROR: {
			const {
				html,
				mode
			} = component;
			if (mode === 'live') {
				return null;
			}
			return (
				<ErrorComponent html={html}/>
			);
		}
		case RENDERABLE_COMPONENT_TYPE.WARNING: {
			const {
				html,
				mode
			} = component;
			if (mode === 'live') {
				return null;
			}
			return (
				<Warning html={html}/>
			);
		}
	} // switch

	console.error(`Unknown component type: ${type}`);
	return (
		<XpFallback component={component as Component}/>
	);

} // XpComponent
