import type {Region as RegionType} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import type {RenderableComponent} from '../types';

import {Region} from './Region';

export interface RegionsProps {
	componentRegistry: ComponentRegistry;
	regions: Record<string, RegionType>;
}

export function Regions({
	componentRegistry,
	regions
}: RegionsProps) {
	// console.debug('Regions regions:', regions);
	return Object.keys(regions).map((name, i) =>
		<Region
			components={regions[name].components as RenderableComponent[]}
			componentRegistry={componentRegistry}
			key={`region-${i}-${name}`}
			name={name}
		/>
	)
}
