import type {InfoPanelProps} from '../processComponents/InfoPanel';

import {
	// beforeAll,
	// afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
import * as React from 'react';

// SRC imports
import {ComponentRegistry} from '../../src/ComponentRegistry';
import {BasePart} from '../../src/ComponentRegistry/BasePart';
import {processComponents} from '../../src/processComponents';

// TEST imports
import {InfoPanel} from '../processComponents/InfoPanel';
import {
	PART_COMPONENT,
	PROCESSED_HTML
} from '../processComponents/data'
import {PART_SCHEMA} from '../processComponents/schema'
import {ExamplePart} from './ExamplePart';


const componentRegistry = new ComponentRegistry;
// const macroName = 'com.enonic.app.react4xp:info'; // NOPE, just 'info'
const macroName = 'info';
componentRegistry.addMacro(macroName, {
	View: InfoPanel
});
const partName = 'com.enonic.app.react4xp:example';
componentRegistry.addPart(partName, {
	View: ExamplePart
});

describe('ComponentRegistry', () => {
	it('should be able to render a part component', () => {
		const processedComponent = processComponents({
			component: PART_COMPONENT,
			getComponentSchema: () => {
				return PART_SCHEMA;
			},
			// @ts-expect-error
			getContentByKey: ({key}) => {
				console.debug("getContentByKey:", key);
				return {};
			},
			listSchemas: ({
				application,
				type
			}) => {
				console.debug("listSchemas:", application, type);
				return [];
			},
			processHtml: ({ value }) => {
				// console.info("processHtml:", value);
				return PROCESSED_HTML;
			},
		});
		const element = render(<BasePart
			componentRegistry={componentRegistry}
			component={processedComponent}
		/>).container;
		expect(toDiffableHtml(element.outerHTML)).toEqual(toDiffableHtml(`
<div>
	<div>
		<section>
			<p>
				<div class="macro-panel macro-panel-info macro-panel-styled">
					<i class="icon">
					</i>
					<strong>
						Header
					</strong>
					Text
				</div>
			</p>
		</section>
		<section>
			<p>
				<div class="macro-panel macro-panel-info macro-panel-styled">
					<i class="icon">
					</i>
					<strong>
						Header
					</strong>
					Text
				</div>
			</p>
		</section>
		<section>
			<p>
				<div class="macro-panel macro-panel-info macro-panel-styled">
					<i class="icon">
					</i>
					<strong>
						Header
					</strong>
					Text
				</div>
			</p>
		</section>
	</div>
</div>
	 `));
		// expect(componentRegistry.hasMacro(macroName)).toBe(false);
	});
});
