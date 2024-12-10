import type {TextProps} from '../types';

import cx from 'clsx';
import {XP_REQUEST_MODE} from '../constants';
import {RichText} from '../RichText/RichText';


export function Text({
	as,
	className,
	componentRegistry,
	data,
	...extraProps
}: TextProps): JSX.Element {
	const ElementType = (as || 'div') as React.ElementType;
	return (
		<ElementType
			className={cx(className)}

			// Needed by BaseText to add
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
