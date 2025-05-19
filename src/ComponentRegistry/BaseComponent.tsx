import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import type {ProcessedData} from '../types';

import {toStr} from '@enonic/js-utils/value/toStr';
import * as React from 'react';

import {PROCESSED_DATA_TYPE, XP_REQUEST_MODE} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
import {Warning} from '../Common/Warning';
import {BaseLayout} from './BaseLayout';
import {BasePage} from './BasePage';
import {BasePart} from './BasePart';
import {BaseText} from './BaseText';
import {BaseContentType} from './BaseContentType';
import {XpFallback} from './XpFallback';


export function BaseComponent({
	data,
	componentRegistry
}: {
	data: ProcessedData
	componentRegistry?: ComponentRegistry
}) {
	// console.debug('BaseComponent component:', toStr(component));

	if (!componentRegistry) {
		console.warn('BaseComponent componentRegistry missing! with component:', toStr(data));
		return (
			<XpFallback data={data as Component}/>
		);
	}

	const {
		type
	} = data;
	if (!type) {
		console.error('BaseComponent component missing type:', toStr(data));
		return (
			<XpFallback data={data}/>
		);
	}
	// console.info('BaseComponent type:', type);

	switch (type) {
		case PROCESSED_DATA_TYPE.PART:
			return (
				<BasePart
					data={data}
					componentRegistry={componentRegistry}
				/>
			);
		case PROCESSED_DATA_TYPE.LAYOUT:
			return (
				<BaseLayout
					data={data}
					componentRegistry={componentRegistry}
				/>
			);
		case PROCESSED_DATA_TYPE.PAGE:
			return (
				<BasePage
					data={data}
					componentRegistry={componentRegistry}
				/>
			);
		case PROCESSED_DATA_TYPE.CONTENT_TYPE:
			return (
				<BaseContentType
					data={data}
					componentRegistry={componentRegistry}
				/>
			);
		case PROCESSED_DATA_TYPE.TEXT: {
			return (
				<BaseText
					data={data}
					componentRegistry={componentRegistry}
				/>
			);
		}
		case PROCESSED_DATA_TYPE.ERROR: {
			const {
				html,
				mode
			} = data;
			if (mode === XP_REQUEST_MODE.LIVE) {
				return null;
			}
			return (
				<ErrorComponent html={html}/>
			);
		}
		case PROCESSED_DATA_TYPE.WARNING: {
			const {
				html,
				mode
			} = data;
			if (mode === XP_REQUEST_MODE.LIVE) {
				return null;
			}
			return (
				<Warning html={html}/>
			);
		}
	} // switch

	console.error(`Unknown component type: ${type}`);
	return (
		<XpFallback data={data as Component}/>
	);

} // BaseComponent
