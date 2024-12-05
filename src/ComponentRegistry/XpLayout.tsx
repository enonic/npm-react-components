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
	...extraProps
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
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by XpBaseLayout to add
			// data-portal-component-type='layout'
			// when request.mode === 'edit'.
			{...extraProps}
		>
			{children}
			<XpRegions
				componentRegistry={componentRegistry}
				regions={regions}
			/>
		</ElementType>
	);
}
