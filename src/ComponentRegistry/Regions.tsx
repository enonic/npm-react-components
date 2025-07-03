import {RegionsData, ComponentProps, ComponentDataAndProps} from '../types';

import {Region} from './Region';

export function Regions({
    common,
    component,
    meta
}: ComponentProps) {
    // console.debug('Regions regions:', regions);
    let regions: RegionsData;
    if ('regions' in component) {
        regions = component.regions as RegionsData;
    } else {
        console.warn(`Regions: component type "${component.type}" is not supported. Expected "layout" or "page".`);
        return null;
    }

    return Object.keys(regions).map((name, i) =>
        <Region
            data={regions[name].components as ComponentDataAndProps[]}
            common={common}
            meta={meta}
            key={`region-${i}-${name}`}
            name={name}
        />
    )
}
