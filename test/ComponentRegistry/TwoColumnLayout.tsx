import * as React from 'react';
import {XpRegions} from '../../src/ComponentRegistry/XpRegions';

export function TwoColumnLayout(props) {
	// console.debug('TwoColumnLayout props', props);
	const {
		componentRegistry,
		regions,
	} = props;
	return (
		<div style={{
			columnGap: '1em',
			display: 'grid',
			gridTemplateColumns: '1fr 1fr'
		}}>
			<XpRegions
				componentRegistry={componentRegistry}
				regions={regions}
			/>
		</div>
	);
}
