import {XP_REQUEST_MODE, COMPONENT_DATA_TYPE} from '../constants';
import {RequestMode, type LiteralUnion} from '@enonic-types/core';
import * as React from 'react';
import {ReactNode} from 'react';

type ProcessedDataType = `${COMPONENT_DATA_TYPE}`;

export interface ComponentWrapperProps {
    children: ReactNode | undefined;
    type: ProcessedDataType
    mode: LiteralUnion<RequestMode>
}


export const ComponentWrapper = ({
    mode,
    type,
    children
}: ComponentWrapperProps) => {

    if (mode != XP_REQUEST_MODE.EDIT) {
        return children;
    }

    const isComponent = type === COMPONENT_DATA_TYPE.PART ||
        type === COMPONENT_DATA_TYPE.TEXT ||
        type === COMPONENT_DATA_TYPE.LAYOUT ||
        type === COMPONENT_DATA_TYPE.PAGE;

    const attrs: Record<string, string> = {}
    if (isComponent) {
        attrs['data-portal-component-type'] = type;
    }

    if (children) {
        // return React.cloneElement(children, attrs);
        return <div {...attrs}>
            {children}
        </div>
    } else {
        return <div {...attrs} />;
    }
}
