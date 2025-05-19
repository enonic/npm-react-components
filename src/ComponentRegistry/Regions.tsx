import type {Region as RegionType} from '@enonic-types/core';
import type {ComponentRegistry} from './ComponentRegistry';
import type {ProcessedData} from '../types';

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
			data={regions[name].components as ProcessedData[]}
			componentRegistry={componentRegistry}
			key={`region-${i}-${name}`}
			name={name}
		/>
	)
}
