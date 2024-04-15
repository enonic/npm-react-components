import type {LinkData} from '../types';


export function findLinkData({
	links,
	ref
}: {
	links: LinkData[]
	ref: string
}) {
	return links.find(data => data.ref === ref);
}
