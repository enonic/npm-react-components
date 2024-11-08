import type {
	PageComponent,
	// PageContributions,
} from '@enonic-types/core';
import type {ClassValue} from 'clsx';
import type {ComponentRegistry} from '../ComponentRegistry';

import cx from 'clsx';
import {XpRegions} from './XpRegions';

export function XpDocument({
	bodyBegin,
	bodyEnd,
	className,
	component,
	componentRegistry,
	headBegin,
	headEnd,
	title
}: {
	bodyBegin?: React.ReactNode;
	bodyEnd?: React.ReactNode;
	className?: ClassValue
	component: PageComponent
	componentRegistry: ComponentRegistry
	headBegin?: React.ReactNode;
	headEnd?: React.ReactNode;
	title?: string
}) {
	const {regions} = component;
	return (
		<html
			className={cx(className)}
		>
			<head>
				{headBegin ? headBegin : null}
				{title ? <title>{title}</title> : null}
				{headEnd ? headEnd : null}
			</head>
			<body className="xp-page">
				{bodyBegin ? bodyBegin : null}
				<XpRegions
					componentRegistry={componentRegistry}
					regions={regions}
				/>
				{bodyEnd ? bodyEnd : null}
			</body>
		</html>
	);
}
