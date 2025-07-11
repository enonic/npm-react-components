import * as React from 'react';
import {RichText} from '../../src/RichText/RichText';
import type {ComponentProps, RichTextData} from '../../src/types';

export function ExamplePart(props: ComponentProps) {
	// console.debug('ExamplePart props', props);

	const {
		common,
		component,
		meta,
		data,
	} = props;
	// console.debug('ExamplePart data', data);

	return (
		<div>
			<RichText
				meta={meta}
				common={common}
				component={component}
				data={data as RichTextData}
			/>
		</div>
	);
}
