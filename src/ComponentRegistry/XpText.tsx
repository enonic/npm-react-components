import type {XpTextProps} from '../types';

import cx from 'clsx';
import {XP_REQUEST_MODE} from '../constants';
import {RichText} from '../RichText';


export function XpText({
	as,
	className,
	componentRegistry,
	data,
	...extraProps
}: XpTextProps): JSX.Element {
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by XpBaseText to add
			// data-portal-component-type='text'
			// when request.mode === 'edit'.
			{...extraProps}
		>
			<RichText
				componentRegistry={componentRegistry}
				data={data}
			/>
		</ElementType>
	);
}
