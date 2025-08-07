import type {Component} from '@enonic-types/core';
import type {ComponentProps} from '../types';

import {toStr} from '@enonic/js-utils/value/toStr';
import type {JSX} from 'react';

import {COMPONENT_DATA_TYPE} from '../constants';
import {BaseLayout} from './BaseLayout';
import {BasePage} from './BasePage';
import {BasePart} from './BasePart';
import {BaseText} from './BaseText';
import {BaseContentType} from './BaseContentType';
import {XpFallback} from './XpFallback';
import {ComponentWrapper} from './ComponentWrapper';
import {Message} from '../Common/Message';


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
    if (!type || !Object.values<string>(COMPONENT_DATA_TYPE).includes(type)) {
        console.error('BaseComponent unknown component type:', toStr(component));
        return (
            <XpFallback data={component as Component}/>
        );
    }
    // console.info('BaseComponent type:', type);

    let componentView: JSX.Element | undefined;

    switch (type) {
        case COMPONENT_DATA_TYPE.PART:
            componentView = <BasePart {...{data, component, common, meta}}/>
            break;
        case COMPONENT_DATA_TYPE.LAYOUT:
            componentView = <BaseLayout {...{data, component, common, meta}}/>
            break;
        case COMPONENT_DATA_TYPE.PAGE:
            componentView = <BasePage {...{data, component, common, meta}}/>
            break;
        case COMPONENT_DATA_TYPE.CONTENT_TYPE:
            componentView = <BaseContentType {...{data, component, common, meta}}/>
            break;
        case COMPONENT_DATA_TYPE.TEXT: {
            componentView = <BaseText {...{data, component, common, meta}}/>
            break;
        }
        case COMPONENT_DATA_TYPE.ERROR: {
            componentView = <Message mode={mode} html={component.html}></Message>
            break;
        }
        case COMPONENT_DATA_TYPE.FRAGMENT: {
            // Initialized fragments are always resolved
            // Uninitialized fragments are not resolved and have type: 'fragment',
            // but there is nothing to render in that case
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
