import type {Region} from '@enonic-types/core';
import type {ComponentRegistry} from '../ComponentRegistry';

import {XpRegion} from './XpRegion';

export function XpRegions({
	componentRegistry,
	regions
}: {
	componentRegistry: ComponentRegistry;
	regions: Record<string, Region>;
}) {
	// console.debug('XpRegions regions:', regions);
	return Object.keys(regions).map((name, i) =>
		<XpRegion
			components={regions[name].components}
			componentRegistry={componentRegistry}
			key={`region-${i}-${name}`}
			name={name}
		/>
	)
}
