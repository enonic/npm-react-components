import React from 'react';


export function Success({
	body,
	header
}: {
	body?: string
	header?: string
}) {
	const headerEl = header && header.trim().length > 0 ? ('<strong>' + header + '</strong>') : '';
	return <div className="macro-panel macro-panel-success macro-panel-styled">
		<i className="icon"></i>
		{headerEl}
		{body}
	</div>;
}
