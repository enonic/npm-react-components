import type {LinkData} from '../types';


export function findLinkData({
	linkRef,
	links,
}: {
	linkRef: string
	links: LinkData[]
}) {
	return links.find(data => data.ref === linkRef);
}
