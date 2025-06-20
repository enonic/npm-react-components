// import type {PartComponent} from '@enonic-types/core';
import type {ComponentRegistry, ProcessedPage, ProcessedProps} from '../types';

import * as React from 'react';
import {Message} from '../Common/Message';
import {ErrorComponent} from '../Common/ErrorComponent';
import {XP_REQUEST_MODE} from '../constants';
import {LayoutProps} from './BaseLayout';

export interface PageProps extends LayoutProps {
}

export function BasePage({
	data,
	common,
	componentRegistry
}: {
	data: ProcessedPage,
	common?: ProcessedProps,
	componentRegistry: ComponentRegistry
}): JSX.Element | undefined {
	const {
		descriptor,
		error,
		mode,
		props,
		warning,
		regions
	} = data;

	if (error && (mode === 'inline' || mode === 'preview')) { // In edit mode the error should be handeled by Content Studio.
		return (
			<ErrorComponent {...{
				children: error,
			}}/>
		);
	}

	if (warning && (mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.ADMIN)) {
		return (
			<Message {...{
				children: warning,
				mode
			}}/>
		);
	}

	if (!warning && !error && !descriptor) {
		// The page is not initialized yet, so we return nothing for CS to render a placeholder
		return;
	}

	const pageDefinition = componentRegistry.getPage<PageProps>(descriptor);
	if (!pageDefinition) {
		return (
			<Message mode={mode}>{`Page descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
		);
	}

	const {View: PageView} = pageDefinition;
	if (!PageView) {
		return (
			<Message mode={mode}>{`No View found for page descriptor:${descriptor} in ComponentRegistry!`}</Message>
		);
	}

	if (!props) {
		/*		return (
                    <Message mode={mode}>{`Page component missing props: ${descriptor}!`}</Message>
                );*/
	}

	return (
		<PageView regions={regions} componentRegistry={componentRegistry} data={props} common={common}/>
	);
}
