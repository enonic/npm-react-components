import type {ClassValue} from 'clsx';
import cx from 'clsx';
import type {ComponentRegistry, ProcessedData} from '../types';
import {BaseComponent} from './BaseComponent';


export interface RegionProps {
    as?: string
    className?: ClassValue
    data: ProcessedData[]
    componentRegistry: ComponentRegistry
    name: string
}


export const Region = ({
    as,
    className,
    data = [],
    componentRegistry,
    name
}: RegionProps) => {
    if (!((name || '').trim())) {
        console.error(`<Region NO_NAME> name: ${JSON.stringify(name)}`);
        throw Error(`Can't render <Region> without a 'name' prop.`);
    }
    // console.debug('Region name:', name);

    const ElementType = (as || 'div') as keyof JSX.IntrinsicElements;
    return (
        <ElementType
            className={cx('xp-region', className)}
            data-portal-region={name}
        >
            {
                data.map((data, i) => <BaseComponent
                    data={data}
                    componentRegistry={componentRegistry}
                    key={i}
                />)
            }
        </ElementType>
    );
}
