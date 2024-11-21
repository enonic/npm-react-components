import type {Region} from '@enonic-types/core';
import type {ComponentRegistry} from '../ComponentRegistry';
import type {RenderableComponent} from '../types';

import {XpRegion} from './XpRegion';

export interface XpRegionsProps {
	componentRegistry: ComponentRegistry;
	regions: Record<string, Region>;
}

export function XpRegions({
	componentRegistry,
	regions
}: XpRegionsProps) {
	// console.debug('XpRegions regions:', regions);
	return Object.keys(regions).map((name, i) =>
		<XpRegion
			components={regions[name].components as RenderableComponent[]}
			componentRegistry={componentRegistry}
			key={`region-${i}-${name}`}
			name={name}
		/>
	)
}
