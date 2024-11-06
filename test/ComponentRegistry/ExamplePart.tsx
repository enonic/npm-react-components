import * as React from 'react';
import { RichText } from '../../src/RichText';

export function ExamplePart(props) {
	// console.debug('ExamplePart props', props);

	const {
		componentRegistry,
		data,
	} = props;
	// console.debug('ExamplePart data', data);

	return (
		<div>
			<RichText
				componentRegistry={componentRegistry}
				data={data}
			/>
		</div>
	);
}
