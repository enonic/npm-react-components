import type {ReactNode} from 'react';

import { ContentStudioEditModePlaceholderStyle } from './ErrorComponent';

const lightYellow = '#c9ba9b';
const brown = '#794b02';

export function Warning({
	children,
	...extraProps
}: {
	children: ReactNode
}) {
	return <div {...extraProps} style={{
		...ContentStudioEditModePlaceholderStyle,
		borderColor: lightYellow,
		color: brown,
	}}>{children}</div>
}
