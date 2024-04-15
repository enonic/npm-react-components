import type {ImageData} from '../types';


export function findImageData({
	images,
	ref
}: {
	images: ImageData[]
	ref: string
}) {
	return images.find(data => data.ref === ref);
}
