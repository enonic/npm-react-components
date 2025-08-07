import React from 'react';

export function HtmlComment({comment}: { comment: string }): React.JSX.Element {
	return (
		// Using dangerouslySetInnerHTML avoids encoding < to &lt;
		<div dangerouslySetInnerHTML={{ __html: `<!--${comment}-->` }}/>
	);
}
