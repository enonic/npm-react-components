import type {LayoutComponent} from '@enonic-types/core';
import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from '../ComponentRegistry';

import cx from 'clsx';
import {XpRegions} from './XpRegions';

export function XpLayout({
	as,
	className,
	component,
	componentRegistry,
}: {
	as?: string;
	className?: ClassValue;
	component: LayoutComponent;
	componentRegistry: ComponentRegistry;
}) {
	// console.debug('XpLayout component:', component.descriptor);
	const {regions} = component;
	const ElementType = (as || 'div') as keyof JSX.IntrinsicElements;
	return (
		<ElementType
			className={cx(className)}
		>
			<XpRegions
				regions={regions}
				componentRegistry={componentRegistry}
			/>
		</ElementType>
	);
}
