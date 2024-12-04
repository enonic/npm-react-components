import type {LiteralUnion} from '@enonic-types/core';
import type {ClassValue} from 'clsx';

import cx from 'clsx';

export function XpPart({
	as,
	children,
	className,
	...extraProps
}: Omit<
	React.HTMLAttributes<HTMLElement>,
	'className'
> & {
	as?: LiteralUnion<keyof JSX.IntrinsicElements>;
	children?: React.ReactNode
	className?: ClassValue
}) {
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by XpBasePart to add
			// data-portal-component-type='part'
			// when request.mode === 'edit'.
			{...extraProps}
		>
			{children}
		</ElementType>
	);
}
