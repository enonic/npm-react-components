// import type {InfoPanelProps} from '../processComponents/InfoPanel';

import {describe, test as it} from '@jest/globals';

// SRC imports
import {ComponentRegistry} from '../../src/ComponentRegistry/ComponentRegistry';
// import {ComponentProcessor} from '../../src/processComponents';
// TEST imports
import {InfoPanel} from './InfoPanel';
import {EXAMPLE_PART_DESCRIPTOR} from './data'
import {ExamplePart} from './ExamplePart';

// const componentProcessor = new ComponentProcessor({
// 	getComponentSchema: () => {
// 		return PART_SCHEMA;
// 	},
// 	// @ts-expect-error
// 	getContentByKey: ({key}) => {
// 		// console.debug("getContentByKey:", key);
// 		return {};
// 	},
// 	listSchemas: ({
// 		application,
// 		type
// 	}) => {
// 		// console.debug("listSchemas:", application, type);
// 		return [];
// 	},
// 	processHtml: ({ value }) => {
// 		// console.info("processHtml:", value);
// 		return PROCESSED_HTML;
// 	},
// });

// componentProcessor.addPart(EXAMPLE_PART_DESCRIPTOR, {
// 	toProps: ({
// 		component,
// 		content,
// 		processedConfig,
// 		request,
// 	}) => {
// 		// console.debug("addPart:", { component, content, processedConfig, request });
// 		return {
// 			data: processedConfig.anHtmlArea
// 		};
// 	},
// });

const componentRegistry = new ComponentRegistry;
// const macroName = 'com.enonic.app.react4xp:info'; // NOPE, just 'info'
const macroName = 'info';
componentRegistry.addMacro(macroName, {
	View: InfoPanel
});
componentRegistry.addPart(EXAMPLE_PART_DESCRIPTOR, {
	View: ExamplePart
});

describe('ComponentRegistry', () => {
	it.skip('should be able to render a part component', () => {
		// const processedComponent = componentProcessor.process({
		// 	component: PART_COMPONENT,
		// 	content: PAGE_CONTENT,
		// 	request: {} as Request,
		// }) as RenderablePartComponent;
		// print(processedComponent, { maxItems: Infinity });
// 		const element = render(<XpPart
// 			componentRegistry={componentRegistry}
// 			component={processedComponent}
// 		/>).container;
// 		expect(toDiffableHtml(element.outerHTML)).toEqual(toDiffableHtml(`
// <div>
// 	<div>
// 		<section>
// 			<div class="macro-panel macro-panel-info macro-panel-styled">
// 				<i class="icon">
// 				</i>
// 				<strong>
// 					Header
// 				</strong>
// 				Text
// 			</div>
// 		</section>
// 	</div>
// </div>
// 	 `));
		// expect(componentRegistry.hasMacro(macroName)).toBe(false);
	});
});
