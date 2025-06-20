import type {Component} from '@enonic-types/core';
import type {ComponentRegistry, ProcessedData, ProcessedProps} from '../types';

import {toStr} from '@enonic/js-utils/value/toStr';
import * as React from 'react';

import {PROCESSED_DATA_TYPE, XP_REQUEST_MODE} from '../constants';
import {ErrorComponent} from '../Common/ErrorComponent';
import {Warning} from '../Common/Warning';
import {BaseLayout} from './BaseLayout';
import {BasePage} from './BasePage';
import {BasePart} from './BasePart';
import {BaseText} from './BaseText';
import {BaseContentType} from './BaseContentType';
import {XpFallback} from './XpFallback';
import {ComponentWrapper} from './ComponentWrapper';


export function BaseComponent({
    data,
    common,
    componentRegistry
}: {
    data: ProcessedData
    common?: ProcessedProps
    componentRegistry?: ComponentRegistry
}) {
    // console.debug('BaseComponent component:', toStr(data));

    if (!componentRegistry) {
        console.warn('BaseComponent componentRegistry missing! with component:', toStr(data));
        return (
            <XpFallback data={data as Component}/>
        );
    }

    const {
        type,
        mode
    } = data;
    if (!type || !Object.values<string>(PROCESSED_DATA_TYPE).includes(type)) {
        console.error('BaseComponent unknown component type:', toStr(data));
        return (
            <XpFallback data={data as Component}/>
        );
    }
    // console.info('BaseComponent type:', type);

    let componentView: JSX.Element | undefined;

    switch (type) {
        case PROCESSED_DATA_TYPE.PART:
            componentView = <BasePart {...{data, common, componentRegistry}}/>
            break;
        case PROCESSED_DATA_TYPE.LAYOUT:
            componentView = <BaseLayout {...{data, common, componentRegistry}}/>
            break;
        case PROCESSED_DATA_TYPE.PAGE:
            componentView = <BasePage {...{data, common, componentRegistry}}/>
            break;
        case PROCESSED_DATA_TYPE.CONTENT_TYPE:
            componentView = <BaseContentType {...{data, common, componentRegistry}}/>
            break;
        case PROCESSED_DATA_TYPE.TEXT: {
            componentView = <BaseText {...{data, common, componentRegistry}}/>
            break;
        }
        case PROCESSED_DATA_TYPE.ERROR: {
            const {
                html,
                mode
            } = data;
            if (shouldRenderError(mode)) {
                componentView = <ErrorComponent html={html}/>
            }
            break;
        }
        case PROCESSED_DATA_TYPE.WARNING: {
            const {
                html,
                mode
            } = data;
            if (shouldRenderWarning(mode)) {
                componentView = <Warning html={html}/>
            }
            break;
        }
    } // switch


    return (
        <ComponentWrapper type={type} mode={mode}>
            {
                componentView
            }
        </ComponentWrapper>
    );

} // BaseComponent

function shouldRenderWarning(mode: string | undefined): boolean {
    return mode !== XP_REQUEST_MODE.LIVE;
}

function shouldRenderError(mode: string | undefined): boolean {
    return mode !== XP_REQUEST_MODE.LIVE;
}
