import type {ReactNode} from 'react';


export function ErrorComponent({
	children,
}: {
	children: ReactNode
}) {
	return <div style={{
		border: '1px dotted red',
		color: 'red'
	}}>{children}</div>
}
