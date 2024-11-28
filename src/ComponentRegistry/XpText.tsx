import type {XpTextProps} from '../types';

import cx from 'clsx';
import {XP_REQUEST_MODE} from '../constants';
import {RichText} from '../RichText';


export function XpText({
	as,
	className,
	componentRegistry,
	data,
	mode,
	...rest
}: XpTextProps) {
	const ElementType = (as || 'div') as React.ElementType;
	if (mode === XP_REQUEST_MODE.EDIT) {
		rest['data-portal-component-type'] = 'text';
	}
	return (
		<ElementType
			className={cx(className)}
			{...rest}
		>
			{
				// mode !== XP_REQUEST_MODE.EDIT
				// 	?
					<RichText
						componentRegistry={componentRegistry}
						data={data}
					/>
					// : null // This actually breaks text components in edit mode.
			}
		</ElementType>
	);
}
