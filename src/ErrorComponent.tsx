import type {ReactNode} from 'react';

// NOTE: "Error" is a property on the global object in Ecmascript.
export function ErrorComponent({
	children,
}: {
	children: ReactNode
}) {
	return <div style={{
		backgroundColor: '#e0b4b4',
		border: '1px dotted #9f3a38',
		borderRadius: '4px',
		color: '#9f3a38',
		padding: '1em 1.5em',
	}}>{children}</div>
}
