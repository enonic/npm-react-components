import type {
	LiteralUnion,
	Region
} from '@enonic-types/core';
import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from '../ComponentRegistry';

import cx from 'clsx';
import {XpRegions} from './XpRegions';

export function XpLayout({
	as,
	children,
	className,
	componentRegistry,
	regions,
	...rest
}: Omit<
	React.HTMLAttributes<HTMLElement>,
	'className'
> & {
	as?: LiteralUnion<keyof JSX.IntrinsicElements>;
	children?: React.ReactNode
	className?: ClassValue;
	componentRegistry: ComponentRegistry;
	regions: Record<string, Region>;
}) {
	// console.debug('XpLayout component:', component.descriptor);
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}
			data-portal-component-type="layout"
			{...rest}
		>
			{children}
			<XpRegions
				componentRegistry={componentRegistry}
				regions={regions}
			/>
		</ElementType>
	);
}
