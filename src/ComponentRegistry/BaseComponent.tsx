import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import type {RenderableComponent} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';

import {RENDERABLE_COMPONENT_TYPE} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
import {Warning} from '../Common/Warning';
import {BaseLayout} from './BaseLayout';
import {BasePage} from './BasePage';
import {BasePart} from './BasePart';
import {BaseText} from './BaseText';
import {BaseContentType} from './BaseContentType';
import {XpFallback} from './XpFallback';


export function BaseComponent({
	component,
	componentRegistry
}: {
	component: RenderableComponent
	componentRegistry?: ComponentRegistry
}) {
	// console.debug('BaseComponent component:', toStr(component));

	if (!componentRegistry) {
		console.warn('BaseComponent componentRegistry missing! with component:', toStr(component));
		return (
			<XpFallback component={component as Component}/>
		);
	}

	const {
		type
	} = component;
	if (!type) {
		console.error('BaseComponent component missing type:', toStr(component));
		return (
			<XpFallback component={component}/>
		);
	}
	// console.info('BaseComponent type:', type);

	switch (type) {
		case RENDERABLE_COMPONENT_TYPE.PART:
			return (
				<BasePart
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.LAYOUT:
			return (
				<BaseLayout
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.PAGE:
			return (
				<BasePage
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.CONTENT_TYPE:
			return (
				<BaseContentType
					component={component}
					componentRegistry={componentRegistry}
				/>
			);
		case RENDERABLE_COMPONENT_TYPE.TEXT: {
			return (
				<BaseText
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

} // BaseComponent
