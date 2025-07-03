import type {ClassValue} from 'clsx';
import cx from 'clsx';
import type {ComponentDataAndProps, MetaData} from '../types';
import {BaseComponent} from './BaseComponent';


export interface RegionProps {
    as?: string
    className?: ClassValue
    data: ComponentDataAndProps[]
    common?: Record<string, unknown>
	meta: MetaData
    name: string
}


export const Region = ({
    as,
    className,
    common,
	meta,
    data = [],
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
					component={data.component}
					data={data.data}
					meta={meta}
                    common={common}
                    key={i}
                />)
            }
        </ElementType>
    );
}
