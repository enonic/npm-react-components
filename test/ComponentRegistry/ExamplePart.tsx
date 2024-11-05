import * as React from 'react';
import { RichText } from '../../src/RichText';

export function ExamplePart(props) {
	// console.debug('ExamplePart props', props);

	const {
		anHtmlArea,
		anItemSet: {
			anHtmlArea: anItemHtmlArea,
		},
		anOptionSet,
		componentRegistry,
	} = props;
	// console.debug('ExamplePart anOptionSet', anOptionSet);

	const anOptionSetHtmlArea = anOptionSet[1].text.anHtmlArea;
	// console.debug('ExamplePart anOptionSetHtmlArea', anOptionSetHtmlArea);

	return (
		<div>
			<RichText
				componentRegistry={componentRegistry}
				data={anHtmlArea}
			/>
			<RichText
				componentRegistry={componentRegistry}
				data={anItemHtmlArea}
			/>
			<RichText
				componentRegistry={componentRegistry}
				data={anOptionSetHtmlArea}
			/>
		</div>
	);
}
