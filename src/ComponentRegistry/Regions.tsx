import type {ComponentRegistry, ProcessedData, ProcessedProps, ProcessedRegions} from '../types';

import {Region} from './Region';

export interface RegionsProps {
    componentRegistry: ComponentRegistry;
    regions: ProcessedRegions;
    common?: ProcessedProps;
}

export function Regions({
    componentRegistry,
    common,
    regions
}: RegionsProps) {
    // console.debug('Regions regions:', regions);
    return Object.keys(regions).map((name, i) =>
        <Region
            data={regions[name].components as ProcessedData[]}
            common={common}
            componentRegistry={componentRegistry}
            key={`region-${i}-${name}`}
            name={name}
        />
    )
}
