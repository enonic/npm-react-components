import type {Element} from 'domhandler';
import type {
	ImageComponent,
	ImageData
} from '../types';


import React from 'react';
import {IMG_ATTR} from '../constants';
import {cssToReactStyle} from './cssToReactStyle';
import {ErrorBoundary} from './ErrorBoundary';
import {ErrorComponent} from './ErrorComponent';
import {findImageData} from './findImageData';


export function replaceImage({
	el,
	Image,
	images,
}: {
	el: Element
	Image: ImageComponent
	images?: ImageData[]
}) {
	if (!images || !images.length) {
		return <ErrorComponent>Can't replace image, when there are no images in the data object!</ErrorComponent>
	}

	const imageRef = el.attribs[IMG_ATTR];
	if (!imageRef) {
		return <ErrorComponent>Image element has no data-image-ref attibute!</ErrorComponent>
	}

	const imageData = findImageData({
		images,
		imageRef
	});
	if (!imageData) {
		return <ErrorComponent>Unable to find image with ref {imageRef} in images object!</ErrorComponent>
	}

	const {
		attribs: {
			alt,
			sizes,
			src,
			srcset: srcSet,
			style: styleStr = ''
		}
	} = el;

	const style = cssToReactStyle(styleStr);

	const {
		image,
		style: imageStyle
	} = imageData;

	const imgProps = {alt, image, imageStyle, sizes, src, srcSet, style};

	return <ErrorBoundary Fallback={({error}) => <ErrorComponent>{error.message}</ErrorComponent>}>
		<Image {...imgProps} />
	</ErrorBoundary>;
}
