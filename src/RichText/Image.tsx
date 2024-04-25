import type {ImageComponent} from '../../src/types';


import React from 'react';
import {cssToReactStyle} from '../../src/RichText/cssToReactStyle';


export const Image: ImageComponent = ({
	alt,
	// image,
	// imageStyle,
	sizes,
	src,
	srcset,
	styleStr,
}) => {
	// const {
	// 	_id,
	// 	_name,
	// 	_path,
	// 	type,
	// 	imageUrl
	// } = image;
	// const {
	// 	aspectRatio,
	// 	filter,
	// 	name
	// } = imageStyle;
	return <img
		alt={alt}
		sizes={sizes}
		src={src}
		srcSet={srcset}
		style={cssToReactStyle(styleStr)}
	/>;
}
