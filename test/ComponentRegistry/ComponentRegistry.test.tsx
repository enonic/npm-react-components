import type {InfoPanelProps} from './InfoPanel';

import {
	// beforeAll,
	// afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';
import {ComponentRegistry} from '../../src/ComponentRegistry/ComponentRegistry';
import {ExamplePart} from './ExamplePart';
import {InfoPanel} from './InfoPanel';

const componentRegistry = new ComponentRegistry;

describe('ComponentRegistry', () => {
	it('should be able to register macro components', () => {
		const macroName = 'com.enonic.app.react4xp:info';
		expect(componentRegistry.hasMacro(macroName)).toBe(false);
		expect(componentRegistry.getMacro<InfoPanelProps>(macroName)).toBe(undefined);
		componentRegistry.addMacro(macroName, {
			View: InfoPanel
		});
		expect(componentRegistry.hasMacro(macroName)).toBe(true);
		expect(componentRegistry.getMacro<InfoPanelProps>(macroName)).toEqual({
			View: InfoPanel
		});
	});
	it('should be able to register part components', () => {
		const partName = 'com.enonic.app.react4xp:example';
		expect(componentRegistry.hasPart(partName)).toBe(false);
		expect(componentRegistry.getPart(partName)).toBe(undefined);
		componentRegistry.addPart(partName, {
			View: ExamplePart
		});
		expect(componentRegistry.hasPart(partName)).toBe(true);
		expect(componentRegistry.getPart(partName)).toEqual({
			View: ExamplePart
		});
	});
});
