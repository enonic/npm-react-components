// import React from 'react';


export function Macro({
	config,
	descriptor
					  }: { config: any, descriptor: string }) {
	// throw new Error(`Macro not found: ${descriptor}`);
	return <div style={{
		border: '1px dotted orange',
		color: 'orange'
	}}>No Macro component provided to RichText. Can't render {descriptor} with config {JSON.stringify(config, null, 4)}</div>
}
