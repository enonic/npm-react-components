import * as React from 'react';
import {XpRegions} from '../../src/ComponentRegistry/XpRegions';

export function DefaultPage(props) {
	// console.debug('DefaultPage props', props);
	const {
		componentRegistry,
		regions,
	} = props;
	return (
		<div className="default-page">
			<XpRegions
				componentRegistry={componentRegistry}
				regions={regions}
			/>
		</div>
	);
}
