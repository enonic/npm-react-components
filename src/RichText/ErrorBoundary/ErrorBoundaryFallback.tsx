import type {LiteralUnion, RequestMode} from '@enonic-types/core';
import {Message} from '../../Common/Message';
import {XP_REQUEST_MODE} from '../../constants';
import React from 'react';

export function getFallback(mode?: LiteralUnion<RequestMode>) {
    return ({error}) => (
        <Message mode={mode}>
            <h2>Error rendering component</h2>
            <p>{error.message}</p>
            {
                (mode === XP_REQUEST_MODE.EDIT && error.stack) && <pre>{error.stack}</pre>
            }
        </Message>
    )
}
