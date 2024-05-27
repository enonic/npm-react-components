import type {MacroComponent} from '../types';


// import React from 'react';


export const Macro: MacroComponent = ({
	config,
	// contentId: _contentId,
	descriptor
}) => {
	// throw new Error(`Macro not found: ${descriptor}`);
	return <div style={{
		border: '1px dotted orange',
		color: 'orange'
	}}>No Macro component provided to RichText. Can't render {descriptor} with config {JSON.stringify(config, null, 4)}</div>
}
