import type {
	LiteralUnion,
	Region
} from '@enonic-types/core';
import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from './ComponentRegistry';

import cx from 'clsx';
import {Regions} from './Regions';

export function Layout({
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
	as?: LiteralUnion<keyof React.JSX.IntrinsicElements>;
	children?: React.ReactNode
	className?: ClassValue;
	componentRegistry: ComponentRegistry;
	regions: Record<string, Region>;
}) {
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by BaseLayout to add
			// data-portal-component-type='layout'
			// when request.mode === 'edit'.
			{...extraProps}
		>
			{children}
			<Regions
				componentRegistry={componentRegistry}
				regions={regions}
			/>
		</ElementType>
	);
}
