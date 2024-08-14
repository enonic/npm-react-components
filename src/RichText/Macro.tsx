// import React from 'react';


import type {MacroComponentParams} from '../types';

export function Macro({
                          config,
                          descriptor
                      }: MacroComponentParams) {
    // throw new Error(`Macro not found: ${descriptor}`);
    return <div style={{
        border: '1px dotted orange',
        color: 'orange'
    }}>No Macro component provided to RichText. Can't render {descriptor} with config {JSON.stringify(config, null, 4)}</div>
}
