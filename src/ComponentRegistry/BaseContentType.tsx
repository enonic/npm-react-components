import type {ContentTypeData, ComponentProps} from '../types';

import type {JSX} from 'react';
import {Message} from '../Common/Message';

// import { XP_REQUEST_MODE } from '../constants';


export const BaseContentType = ({
    component,
    data,
    common,
    meta
}: ComponentProps<ContentTypeData>): JSX.Element => {
    const {
        contentType
        // NOTE: Such a warning would typically come from lib-react4xp DataFecther.
        // But there are currently no such warnings returned in dataFecther.processContentType();
        // warning,
    } = component;

    const {mode, componentRegistry} = meta;

    // if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
    // 	return (
    // 		<Message mode={mode}>{warning}</Message>
    // 	);
    // }

    const contentTypeDefinition = componentRegistry.getContentType<ComponentProps>(contentType);
    if (!contentTypeDefinition) {
        return (
            <Message mode={mode}>{`ContentType:${contentType} not registered in ComponentRegistry!`}</Message>
        );
    }

    const {View: ContentTypeView} = contentTypeDefinition;
    if (!ContentTypeView) {
        return (
            <Message mode={mode}>{`No View found for contentType:${contentType} in ComponentRegistry!`}</Message>
        );
    }

    return (
        <ContentTypeView component={component} data={data} common={common} meta={meta}/>
    );
};
