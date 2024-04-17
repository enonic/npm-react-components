import type {ImageData} from '../types';


export function findImageData({
	imageRef,
	images,
}: {
	imageRef: string
	images: ImageData[]
}) {
	return images.find(data => data.ref === imageRef);
}
