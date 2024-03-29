import type {Region as RegionType} from '@enonic-types/core';

import PropTypes from 'prop-types';

import Regions from './Regions';

/**
 * Page controller template: wraps a react rendering of a bare-bones HTML page, with regions if supplied with regions data.
 * Can be used as a wrapping component, neating regular react children: <Page title="Page title"><h1>A heading!</h1></Page>
 *
 * @param {string} [title] - Page title string
 * @param {Object} [regionsData] - regions data object (e.g. content.page.regions).
 *     Keys are region names, values are region data.
 * @param {(string|string[])} [regionNames] - selects to display only one, or some specific, of the available regions in the
 *     regions data. The array defines sequence, so this can also be used to display of all regions in a specific order.
 *     If omitted, all regions are displayed in the order of Object.keys(regionsData).
 * @param {(boolean|string|Object)} [regionClasses] - HTML class for the region elements, added after "xp-region".
 *     If boolean, and it's true: adds a class that is the same as the name
 *     If string, all regions get that class.
 *     If object: keys are region names and values are a class name string for each region.
 * @param {React.ReactNode} [children] - nested react components
 * @param {boolean} [childrenAfterRegions] - if false or omitted, children will be rendered first in body.
 *     If true, they will be rendered below the regions.
 * @returns React component array with <head> and <body>, but NOT <html>! This is left up to the calling
 * context.
 */
const Page = ({
	title,
	regionsData,
	regionNames,
	regionClasses,
	children,
	childrenAfterRegions
}: {
	title?: string
	regionsData?: Record<string, RegionType>
	regionNames?: string | string[]
	regionClasses?: boolean | string | Record<string, string>
	children?: React.ReactNode
	childrenAfterRegions?: boolean
}): React.JSX.Element[] => {
	return [
		<head>
			{title ? <title>{title}</title> : null}
		</head>,
		<body className="xp-page">
			{!childrenAfterRegions ? children : null}
			{regionsData ? <Regions regionsData={regionsData} classes={regionClasses} names={regionNames}/> : null}
			{childrenAfterRegions ? children : null}
		</body>,
	];
};


Page.propTypes = {
	title: PropTypes.string,
	regionsData: PropTypes.objectOf(
		PropTypes.shape({
			components: PropTypes.arrayOf(
				PropTypes.shape({
					path: PropTypes.string.isRequired,
				})
			),
		})
	),
	regionNames: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
	]),
	regionClasses: PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.string,
		PropTypes.objectOf(PropTypes.string),
	]),
	childrenAfterRegions: PropTypes.bool,
};

export default Page;
