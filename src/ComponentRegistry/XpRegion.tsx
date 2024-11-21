import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from '../ComponentRegistry';
import type {RenderableComponent} from '../types';

import cx from 'clsx';
import {XpComponent} from './XpComponent';


export interface XpRegionProps {
	as?: string
	className?: ClassValue
	components: RenderableComponent[]
	componentRegistry: ComponentRegistry
	name: string
}


export const XpRegion = ({
	as,
	className,
	components = [],
	componentRegistry,
	name,
}: XpRegionProps) => {
	if (!((name || '').trim())) {
		console.error(`<Region NO_NAME> name: ${JSON.stringify(name)}`);
		throw Error(`Can't render <Region> without a 'name' prop.`);
	}
	// console.debug('XpRegion name:', name);

	const ElementType = (as || 'div') as keyof JSX.IntrinsicElements;
	return (
		<ElementType
			className={cx('xp-region', className)}
			data-portal-region={name}
		>
			{
				components.map((component, i) => <XpComponent
					component={component}
					componentRegistry={componentRegistry}
					key={i}
				/>)
			}
		</ElementType>
	);
}
