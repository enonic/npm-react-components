import type {ComponentRegistry, ProcessedData} from '../types';
import type {ProcessedRegions} from '../types/ProcessedData';

import {Region} from './Region';

export interface RegionsProps {
    componentRegistry: ComponentRegistry;
    regions: ProcessedRegions;
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
