import type {ImageUrlParams} from '@enonic-types/lib-portal';
import {parse} from 'uri-js';


export interface ImageUrlParamsParams {
	background?: string
	filter?: string
	quality?: string
	// [key: string]: string
}


export function parseImageUrl({
	debug = false,
	imageUrl
}: {
	debug?: boolean
	imageUrl: string
}) {
	const uriObj = parse(imageUrl);
	debug && console.debug('uriObj', uriObj);
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
	debug && console.debug('path', path);

	if (!path) {
		throw new Error(`parseImageUrl: No path in imageUrl: ${imageUrl}!`);
	}
	const [pre, post] = path.split('/_/image/');
	debug && console.debug('pre', pre);
	debug && console.debug('post', post);

	const pathParts = pre.split('/');
	pathParts.shift(); // Remove first empty string
	debug && console.debug('pathParts', pathParts);

	let admin;
	if (pathParts[0] === 'admin') {
		admin = pathParts.shift();
	}
	const site = pathParts.shift();
	const mode = pathParts.shift();
	const project = pathParts.shift();
	const branch = pathParts.shift();
	debug && console.debug('pathParts', pathParts);

	const pagePath = pathParts.join('/');
	debug && console.debug({
		admin,
		site,
		mode,
		project,
		branch,
		pagePath // typically ''
	});

	const [imageId, imageParams] = decodeURIComponent(post).split(':');
	const [versionKey, scaling, filename] = imageParams.split('/');
	debug && console.debug({
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
	debug && console.debug('scale', scale);

	let params: ImageUrlParamsParams = {};
	if (query) {
		debug && console.debug('query', query);
		query.split('&').forEach((pair) => {
			const [key, value = ''] = pair.split('=');
			const valueDecoded = decodeURIComponent(value);
			// console.debug('key', key, 'value', value, 'valueDecoded', valueDecoded);
			if (Array.isArray(params[key])) {
				params[key].push(valueDecoded);
			} else if (typeof params[key] !== 'undefined') {
				params[key] = [params[key], valueDecoded];
			} else {
				params[key] = valueDecoded;
			}
		});
	}

	const {background, filter, quality, ...rest} = params;

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
		params: rest,
		port,
		quality: quality ? parseInt(quality, 10) : undefined,
		scale,
		scheme,
		type: reference === 'absolute' ? 'absolute' : undefined as ImageUrlParams['type'],
		versionKey
	}
	debug && console.debug('parseImageUrl(%s) -> %s', {imageUrl}, rv);
	return rv;
}
