import type {LiteralUnion} from '@enonic-types/core';
import type {ClassValue} from 'clsx';

import cx from 'clsx';

export function Part({
	as,
	children,
	className,
	...extraProps
}: Omit<
	React.HTMLAttributes<HTMLElement>,
	'className'
> & {
	as?: LiteralUnion<keyof React.JSX.IntrinsicElements>;
	children?: React.ReactNode
	className?: ClassValue
}) {
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by BasePart to add
			// data-portal-component-type='part'
			// when request.mode === 'edit'.
			{...extraProps}
		>
			{children}
		</ElementType>
	);
}
