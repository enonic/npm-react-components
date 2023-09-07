import type {Region as RegionType} from '@enonic-types/core';

import PropTypes from 'prop-types';

import Regions from './Regions';

/**
 * Layout controller template: wraps a react rendering of a bare-bones XP layout, with regions if supplied with regions data.
 * Can be used as a wrapping component, nesting regular react children: <Layout><h2>A layout!</h2></Layout>
 *
 * @param {Object} [regionsData] - (optional although layouts make little sense without regions): regions data object (e.g. component.regions).
 *     Keys are region names, values are region data.
 * @param {(string|string[])} [regionNames] - selects to display only one, or some specific, of the available regions in the
 *     regions data. The array defines sequence, so this can also be used to display of all regions in a specific order.
 *     If omitted, all regions are displayed in the order of Object.keys(component.regions).
 * @param {(boolean|string|Object)} [regionClasses] - HTML class for the region elements, added after "xp-region".
 *     If boolean, and it's true: adds a class that is the same as the name
 *     If string, all regions get that class.
 *     If object: keys are region names and values are a class name string for each region.
 * @param {string} [containerTag] - the HTML tag of the layout's outer container element. Defaults to 'div'.
 * @param {string} [containerClass] - the HTML class of the layout's outer container element. No default.
 * @param {React.ReactNode} children - nested react components
 * @param {boolean} [childrenAfterRegions] - if false or omitted, children will be rendered first in body.
 *     If true, they will be rendered below the regions.
 * @returns A react4xp-representation (react component) of an XP layout. Must be SERVER-SIDE-rendered by react4xp!
 */
const Layout = ({
	regionsData,
	regionNames,
	regionClasses,
	containerTag,
	containerClass,
	children,
	childrenAfterRegions,
}: {
	regionsData?: Record<string, RegionType>
	regionNames?: string | string[]
	regionClasses?: boolean | string | Record<string, string>
	containerTag?: string
	containerClass?: string
	children?: React.ReactNode
	childrenAfterRegions?: boolean
}): React.JSX.Element => {
	const TAG = (containerTag || 'div') as keyof JSX.IntrinsicElements;

	return <TAG className={containerClass}>
		{!childrenAfterRegions ? children : null}
		{regionsData ? <Regions regionsData={regionsData} classes={regionClasses} names={regionNames}/> : null}
		{childrenAfterRegions ? children : null}
	</TAG>;
};


Layout.propTypes = {
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
	containerTag: PropTypes.string,
	containerClass: PropTypes.string,
	childrenAfterRegions: PropTypes.bool,
};

export default Layout;
