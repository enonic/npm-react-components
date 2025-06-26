import type {Component} from '@enonic-types/core';
import type {ComponentProps} from '../types';

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
    component,
    data,
    common,
    meta
}: ComponentProps) {
    // console.debug('BaseComponent component:', toStr(data));

    const {mode, componentRegistry} = meta;
    if (!componentRegistry) {
        console.warn('BaseComponent componentRegistry missing! with component:', toStr(component));
        return (
            <XpFallback data={component as Component}/>
        );
    }

    const type = component.type;
    if (!type || !Object.values<string>(PROCESSED_DATA_TYPE).includes(type)) {
        console.error('BaseComponent unknown component type:', toStr(component));
        return (
            <XpFallback data={component as Component}/>
        );
    }
    // console.info('BaseComponent type:', type);

    let componentView: JSX.Element | undefined;

    switch (type) {
        case PROCESSED_DATA_TYPE.PART:
            componentView = <BasePart {...{data, component, common, meta}}/>
            break;
        case PROCESSED_DATA_TYPE.LAYOUT:
            componentView = <BaseLayout {...{data, component, common, meta}}/>
            break;
        case PROCESSED_DATA_TYPE.PAGE:
            componentView = <BasePage {...{data, component, common, meta}}/>
            break;
        case PROCESSED_DATA_TYPE.CONTENT_TYPE:
            componentView = <BaseContentType {...{data, component, common, meta}}/>
            break;
        case PROCESSED_DATA_TYPE.TEXT: {
            componentView = <BaseText {...{data, component, common, meta}}/>
            break;
        }
        case PROCESSED_DATA_TYPE.ERROR: {
            const {
                html
            } = component;
            if (shouldRenderError(mode)) {
                componentView = <ErrorComponent html={html}/>
            }
            break;
        }
        case PROCESSED_DATA_TYPE.WARNING: {
            const {
                html
            } = component;
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
