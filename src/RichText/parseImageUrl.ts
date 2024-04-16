import type {ImageUrlParams} from '@enonic-types/lib-portal';
import {parse} from 'uri-js';


const DEBUG = false;


export interface ImageUrlParamsParams {
	background?: string
	filter?: string
	quality?: string
	// [key: string]: string
}


export function parseImageUrl({
	imageUrl
}: {
	imageUrl: string
}) {
	const uriObj = parse(imageUrl);
	DEBUG && console.debug('uriObj', uriObj);
	const {
		// fragment,
		host,
		path,
		port,
		query,
		reference, // 'absolute' | 'relative'
		scheme,
		// userinfo,
	} = uriObj;
	DEBUG && console.debug('path', path);

	if (!path) {
		throw new Error(`parseImageUrl: No path in imageUrl: ${imageUrl}!`);
	}
	const [pre, post] = path.split('/_/image/');
	DEBUG && console.debug('pre', pre);
	DEBUG && console.debug('post', post);

	const pathParts = pre.split('/');
	pathParts.shift(); // Remove first empty string
	DEBUG && console.debug('pathParts', pathParts);

	let admin;
	if (pathParts[0] === 'admin') {
		admin = pathParts.shift();
	}
	const site = pathParts.shift();
	const mode = pathParts.shift();
	const project = pathParts.shift();
	const branch = pathParts.shift();
	DEBUG && console.debug('pathParts', pathParts);

	const pagePath = pathParts.join('/');
	DEBUG && console.debug({
		admin,
		site,
		mode,
		project,
		branch,
		pagePath // typically ''
	});

	const [imageId, imageParams] = decodeURIComponent(post).split(':');
	const [versionKey, scaling, filename] = imageParams.split('/');
	DEBUG && console.debug({
		versionKey, scaling, filename
	});

	const scaleParts = scaling.split('-');
	let scale;
	if (scaleParts.length == 3) {
		scale = `${scaleParts[0]}(${scaleParts[1]},${scaleParts[2]})`;
	} else if (scaleParts.length == 2) {
		scale = `${scaleParts[0]}(${scaleParts[1]})`;
	} else {
		scale = scaling;
	}
	DEBUG && console.debug('scale', scale);

	let params: ImageUrlParamsParams = {};
	if (query) {
		 query.split('&').forEach((pair) => {
			const [key, value] = pair.split('=');
			params[key] = value;
		});
	}

	const {background, filter, quality, ...rest} = params;
	const decodedParams = {};
	Object.keys(rest).forEach((key) => {
		decodedParams[key] = decodeURIComponent(rest[key]);
	});

	const rv = {
		admin,
		background,
		branch,
		filter: filter ? decodeURIComponent(filter) : undefined,
		filename,
		id: imageId,
		mode,
		project,
		host,
		params: decodedParams,
		port,
		quality: quality ? parseInt(quality, 10) : undefined,
		scale,
		scheme,
		type: reference === 'absolute' ? 'absolute' : undefined as ImageUrlParams['type'],
		versionKey
	}
	DEBUG && console.debug('parseImageUrl(%s) -> %s', {imageUrl}, rv);
	return rv;
}
