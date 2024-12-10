import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from './ComponentRegistry';
import type {RenderableComponent} from '../types';

import cx from 'clsx';
import {BaseComponent} from './BaseComponent';


export interface RegionProps {
	as?: string
	className?: ClassValue
	components: RenderableComponent[]
	componentRegistry: ComponentRegistry
	name: string
}


export const Region = ({
	as,
	className,
	components = [],
	componentRegistry,
	name,
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
				components.map((component, i) => <BaseComponent
					component={component}
					componentRegistry={componentRegistry}
					key={i}
				/>)
			}
		</ElementType>
	);
}
