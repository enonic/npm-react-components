import React from 'react';


export function Success({
    body,
    header
}: {
    body?: string
    header?: string
}) {
    return <div className="macro-panel macro-panel-success macro-panel-styled">
        <i className="icon"></i>
        {header && header.trim().length > 0 ? (<strong> + {header} + </strong>) : ''}
        {body}
    </div>;
}
