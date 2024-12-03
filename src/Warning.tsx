import type {ReactNode} from 'react';


export function Warning({
	children,
}: {
	children: ReactNode
}) {
	return <div style={{
		backgroundColor: '#c9ba9b',
		border: '1px dotted #794b02',
		borderRadius: '4px',
		color: '#794b02',
		padding: '1em 1.5em',
	}}>{children}</div>
}
