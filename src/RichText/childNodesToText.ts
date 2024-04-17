import type {ChildNode, Text} from 'domhandler';


import {ElementType} from 'domelementtype';


export function childNodesToText(children: ChildNode[]): Text | undefined {
	const childNode = children?.find(c => c.type === ElementType.Text);
	return childNode ? childNode as Text : undefined;
}
