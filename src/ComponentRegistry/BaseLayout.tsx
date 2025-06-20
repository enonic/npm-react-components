// import type {PartComponent} from '@enonic-types/core';
import {ComponentRegistry, ProcessedLayout, type ProcessedProps} from '../types';

import * as React from 'react';
import {Message} from '../Common/Message';
import {XP_REQUEST_MODE} from '../constants';
import {RegionsProps} from './Regions';

export interface LayoutProps extends RegionsProps {
	data?: ProcessedProps;
}

export function BaseLayout({
	data,
	common,
	componentRegistry
}: {
	data: ProcessedLayout,
	common?: ProcessedProps,
	componentRegistry: ComponentRegistry
}): JSX.Element | undefined {
	const {
		descriptor,
		mode,
		props,
		warning,
		regions
	} = data;

	if (warning && (mode === XP_REQUEST_MODE.EDIT || mode === XP_REQUEST_MODE.INLINE || mode === XP_REQUEST_MODE.ADMIN)) {
		return (
			<Message mode={mode}>
				{warning}
			</Message>
		);
	}

	if (!warning && !descriptor) {
		// The layout is not initialized yet, so we return nothing for CS to render a placeholder
		return;
	}

	const layoutDefinition = componentRegistry.getLayout<LayoutProps>(descriptor);
	if (!layoutDefinition) {
		return (
			<Message mode={mode}>{`Layout descriptor:${descriptor} not registered in ComponentRegistry!`}</Message>
		);
	}

	const {View: LayoutView} = layoutDefinition;
	if (!LayoutView) {
		return (
			<Message mode={mode}>
				{`No View found for layout descriptor:${descriptor} in ComponentRegistry!`}
			</Message>
		);
	}

	if (!props) {
		/*		return (
                    <Message mode={mode}>
                        {`Layout component missing props: ${descriptor}!`}
                    </Message>
                );*/
	}

	return (
		<LayoutView regions={regions} componentRegistry={componentRegistry} data={props} common={common}/>
	);
}
