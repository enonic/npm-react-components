export function HtmlComment({ comment }: { comment: string }): JSX.Element {
	return (
		// Using dangerouslySetInnerHTML avoids encoding < to &lt;
		<div dangerouslySetInnerHTML={{ __html: `<!--${comment}-->` }}/>
	);
}
