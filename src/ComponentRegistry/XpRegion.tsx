import type {Component} from '@enonic-types/core';
import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from '../ComponentRegistry';

import cx from 'clsx';
import {XpComponent} from './XpComponent';

export const XpRegion = ({
	as,
	className,
	components = [],
	componentRegistry,
	name,
}: {
	as?: string
	className?: ClassValue
	components: Component[]
	componentRegistry?: ComponentRegistry
	name: string
}) => {
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
