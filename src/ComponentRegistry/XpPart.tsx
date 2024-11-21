import type {LiteralUnion} from '@enonic-types/core';
import type {ClassValue} from 'clsx';

import cx from 'clsx';

export function XpPart({
	as,
	children,
	className,
	...rest
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
			data-portal-component-type="part"
			{...rest}
		>
			{children}
		</ElementType>
	);
}
