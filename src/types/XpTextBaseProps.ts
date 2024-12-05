// There is a difference between the core enonic types and what Guillotine returns:
import type { LiteralUnion } from '@enonic-types/core';
import type { ClassValue } from 'clsx';
import type { RichTextData } from './RichText';

export interface XpTextBaseProps extends Omit<
	React.HTMLAttributes<HTMLElement>,'className' | 'children'
> {
	as?: LiteralUnion<keyof JSX.IntrinsicElements>;
	className?: ClassValue;
	data: RichTextData;
	'data-portal-component-type'?: 'text';
}
