import {ProcessedData, ProcessedRegions, ComponentProps} from '../types';

import {Region} from './Region';

export function Regions({
    common,
    component,
    meta
}: ComponentProps) {
    // console.debug('Regions regions:', regions);
    let regions: ProcessedRegions;
    if ('regions' in component) {
        regions = component.regions as ProcessedRegions;
    } else {
        console.warn(`Regions: component type "${component.type}" is not supported. Expected "layout" or "page".`);
        return null;
    }

    return Object.keys(regions).map((name, i) =>
        <Region
            data={regions[name].components as ProcessedData[]}
            common={common}
            meta={meta}
            key={`region-${i}-${name}`}
            name={name}
        />
    )
}
