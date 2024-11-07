import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from '../ComponentRegistry';
import type {RichTextData} from '../types';
import type {
	DecoratedLayoutComponent,
	DecoratedPageComponent,
	DecoratedTextComponent,
} from '../types';

import { toStr } from '@enonic/js-utils/value/toStr';
import * as React from 'react';
import {XP_COMPONENT_TYPE} from '../constants';
import {XpComponentComment} from './XpComponentComment';
// import {XpLayout} from './XpLayout';
// import {XpPage} from './XpPage';
import {XpPart} from './XpPart';
import {RichText} from '../RichText';
// import {Macro as FallbackMacro} from './RichText/Macro';
// import {replaceMacroComments} from './replaceMacroComments';


// interface RestProps {
// 	componentRegistry?: ComponentRegistry
// }

// const Macro: MacroComponent<RestProps> = ({
// 	componentRegistry,
// 	config,
// 	descriptor,
// 	children
// }) => {
// 	console.info('MacroWithComponentRegistry', {config, descriptor, children});
// 	if (componentRegistry) {
// 		// @ts-ignore
// 		if (descriptor === 'info') {
// 			const InfoMacro = componentRegistry.getMacro<{
// 				header: string
// 				text: string
// 			}>('macro');
// 			console.info(InfoMacro);
// 			const {
// 				body,
// 				header,
// 			} = config;
// 			console.info('MacroWithComponentRegistry', {body, header});
// 			return (
// 				<InfoMacro header={header} text={body}/>
// 			);
// 		}
// 	}
// 	return null;
// }

export function XpComponent({
	component,
	componentRegistry
}: {
	component: Component
	componentRegistry?: ComponentRegistry
}) {
	// console.info('XpComponent component:', toStr(component));

	if (!componentRegistry) {
		return (
			<XpComponentComment component={component}/>
		);
	}

	const {
		type
	} = component;
	// console.info('XpComponent type:', type);

	if (type === XP_COMPONENT_TYPE.PART) {
		return (
			<XpPart
				component={component}
				componentRegistry={componentRegistry}
			/>
		);
	}

	if (type === XP_COMPONENT_TYPE.LAYOUT) {
		const layoutDefinition = componentRegistry.getLayout(component.descriptor);
		if (!layoutDefinition) {
			throw new Error(`Layout definition not found for descriptor: ${component.descriptor}`);
		}
		const {View: LayoutView} = layoutDefinition;
		if (!LayoutView) {
			throw new Error(`Layout definition missing View for descriptor: ${component.descriptor}`);
		}
		const {props} = component as DecoratedLayoutComponent;
		if (!props) {
			throw new Error(`Layout component missing props: ${component.descriptor}`);
		}
		props.componentRegistry = componentRegistry;
		// console.info('XpComponent LayoutView props:', toStr(props));
		return (
			<LayoutView {...props}/>
		);
	}

	if (type === XP_COMPONENT_TYPE.PAGE) {
		const pageDefinition = componentRegistry.getPage(component.descriptor);
		if (!pageDefinition) {
			throw new Error(`Page definition not found for descriptor: ${component.descriptor}`);
		}
		const {View: PageView} = pageDefinition;
		if (!PageView) {
			throw new Error(`Page definition missing View for descriptor: ${component.descriptor}`);
		}
		const {props} = component as DecoratedPageComponent;
		if (!props) {
			throw new Error(`Page component missing props: ${component.descriptor}`);
		}
		props.componentRegistry = componentRegistry;
		// console.info('XpComponent PageView props:', toStr(props));
		return (
			<PageView {...props}/>
		);
	}

	if (type === XP_COMPONENT_TYPE.TEXT) {
		// console.info('XpComponent text component:', toStr(component));

		const {props} = component as DecoratedTextComponent;
		if (!props) {
			throw new Error(`Text component missing props: ${toStr(component)}`);
		}
		// console.info('XpComponent text component props:', toStr(props));

		const {data} = props;
		console.info('XpComponent text component data:', toStr(data));

		return (
			<div data-portal-component-type="text">
				<RichText
					componentRegistry={componentRegistry}
					data={data}
					// data-portal-component-type="text"
				/>
			</div>
		);
	}

	return (
		<XpComponentComment component={component}/>
	);
}
