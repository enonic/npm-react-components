import type {Component} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
// import type {MacroComponent} from './types';

// import {XP_COMPONENT_TYPE} from './constants';
import ComponentTag from './ComponentTag';
// import {RichText} from './RichText';
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
	// if (!componentRegistry) {
		return ComponentTag(component);
	// }

	// const {
	// 	type
	// } = component;

	// if (type === XP_COMPONENT_TYPE.TEXT) {
	// 	// console.info('XpComponent', {component});

	// 	// const data = {};
	// 	const data = replaceMacroComments(component.text);
	// 	console.info('data', data);

	// 	// componentRegistry={componentRegistry}
	// 	// Macro={Macro}
	// 	return (
	// 		<RichText<RestProps>
	// 			data={data}
	// 		/>
	// 	);
	// }

	// return ComponentTag(component);
}
