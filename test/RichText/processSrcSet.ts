import type {imageUrl as libPortalImageUrl} from '@enonic-types/lib-portal';


import {parseImageUrl} from './parseImageUrl';


// function startsWithHash(url: string): boolean {
// 	return url?.charAt(0) == '#';
// }

// const IMG_ATMT_REGEXP = /_\/image\/|_\/attachment\//;

// function isAttachmentUrl(url: string): boolean {
// 	return IMG_ATMT_REGEXP.test(url);
// }

// function isRelative(url: string): boolean {
// 	return !/^(?:ht|f)tps?:\/\/[^ :\r\n\t]+/.test(url);
// }

// function fixDoubleSlashes(str: string) {
// 	return str.replace(/(^|[^:/])\/{2,}/g, '$1/');
// }

// function process({
// 	url,
// 	serverSide = false,
// 	isResource = false
// }: {
// 	url: string,
// 	serverSide?: boolean
// 	isResource?: boolean
// }): string {
// 	if (this.startsWithHash(url) || (this.isAttachmentUrl(url))) {
// 		// do not process if:
// 		// - url starts with #
// 		// - meta is absent
// 		// - attachment urls in NEXT mode
// 		return url;
// 	}

// 	// let normalUrl: string;
// 	// if (this.isRelative(url)) {
// 	// 	normalUrl = url;
// 	// } else {
// 	// 	// url is absolute, try to make it relative by striping apiUrl
// 	// 	// NB: will fail if content api is not on the same domain as enonic xp
// 	// 	const apiUrl = this.getApiUrl(meta);
// 	// 	normalUrl = this.stripApiUrl(url, apiUrl);
// 	// }

// 	// const baseUrl = meta?.baseUrl && meta?.baseUrl !== '/' ? meta.baseUrl : '';
// 	// const baseUrl = '';

// 	// let result: string;
// 	// if (meta.renderMode === RENDER_MODE.NEXT) {
// 	// 	// only add basePath and locale in next mode
// 	// 	result = `/${normalUrl}`;
// 	// 	if (!isResource && meta.locale !== meta.defaultLocale) {
// 	// 		// append locale if it's not the default one
// 	// 		// to avoid additional middleware redirection
// 	// 		// NB: don't add locale to resource urls
// 	// 		result = `/${meta.locale}${result}`;
// 	// 	}
// 	// 	if (!serverSide) {
// 	// 		// no need for baseurl and basepath on server
// 	// 		result = addBasePath(`${baseUrl}${result}`);
// 	// 	}
// 	// } else {
// 		// result = `${baseUrl}/${normalUrl}`;
// 	// }

// 	// return fixDoubleSlashes(result);
// 	return fixDoubleSlashes(url);
// }

export function processSrcSet({
	imageUrlFn,
	srcset
}: {
	imageUrlFn: typeof libPortalImageUrl
	srcset: string
}): string {
	return srcset.split(/, */g).map(src => {
		const srcParts = src.trim().split(' ');
		let imageUrl;
		switch (srcParts.length) {
			case 1: // src only
				imageUrl = src;
				break;
			case 2: // width descriptor
				imageUrl = srcParts[0];
				break;
			case 3: // pixel density descriptor
				imageUrl = srcParts[0];
				break;
			default:
				console.warn('Can not process image srcset: ' + src);
				return src;
		} // switch
		const {
			// admin,
			background,
			// branch,
			filter,
			// filename,
			id,
			// mode,
			// project,
			// host,
			params,
			// port,
			quality,
			scale,
			// scheme,
			type,
			// versionKey
		} = parseImageUrl({imageUrl})
		const newSrc = imageUrlFn({
			background,
			id,
			filter,
			// format,
			params,
			quality,
			scale,
			type,
		});
		switch (srcParts.length) {
			case 1: // src only
				return newSrc;
			case 2: // width descriptor
				return `${newSrc} ${srcParts[1]}`;
			case 3: // pixel density descriptor
				return `${newSrc} ${srcParts[1]} ${srcParts[2]}`;
		} // switch
	}).join(', ');
}
