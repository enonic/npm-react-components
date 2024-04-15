function startsWithHash(url: string): boolean {
	return url?.charAt(0) == '#';
}

const IMG_ATMT_REGEXP = /_\/image\/|_\/attachment\//;

function isAttachmentUrl(url: string): boolean {
	return IMG_ATMT_REGEXP.test(url);
}

function isRelative(url: string): boolean {
	return !/^(?:ht|f)tps?:\/\/[^ :\r\n\t]+/.test(url);
}

function fixDoubleSlashes(str: string) {
	return str.replace(/(^|[^:/])\/{2,}/g, '$1/');
}

function process({
	url,
	serverSide = false,
	isResource = false
}: {
	url: string,
	serverSide?: boolean
	isResource?: boolean
}): string {
	if (this.startsWithHash(url) || (this.isAttachmentUrl(url))) {
		// do not process if:
		// - url starts with #
		// - meta is absent
		// - attachment urls in NEXT mode
		return url;
	}

	// let normalUrl: string;
	// if (this.isRelative(url)) {
	// 	normalUrl = url;
	// } else {
	// 	// url is absolute, try to make it relative by striping apiUrl
	// 	// NB: will fail if content api is not on the same domain as enonic xp
	// 	const apiUrl = this.getApiUrl(meta);
	// 	normalUrl = this.stripApiUrl(url, apiUrl);
	// }

	// const baseUrl = meta?.baseUrl && meta?.baseUrl !== '/' ? meta.baseUrl : '';
	// const baseUrl = '';

	// let result: string;
	// if (meta.renderMode === RENDER_MODE.NEXT) {
	// 	// only add basePath and locale in next mode
	// 	result = `/${normalUrl}`;
	// 	if (!isResource && meta.locale !== meta.defaultLocale) {
	// 		// append locale if it's not the default one
	// 		// to avoid additional middleware redirection
	// 		// NB: don't add locale to resource urls
	// 		result = `/${meta.locale}${result}`;
	// 	}
	// 	if (!serverSide) {
	// 		// no need for baseurl and basepath on server
	// 		result = addBasePath(`${baseUrl}${result}`);
	// 	}
	// } else {
		// result = `${baseUrl}/${normalUrl}`;
	// }

	// return fixDoubleSlashes(result);
	return fixDoubleSlashes(url);
}

export function processSrcSet(srcset: string): string {
	return srcset.split(/, */g).map(src => {
		const srcParts = src.trim().split(' ');
		switch (srcParts.length) {
			case 1: // src only
				return this.process({url: src});
			case 2: // width descriptor
				return `${this.process({url: srcParts[0]})} ${srcParts[1]}`;
			case 3: // pixel density descriptor
				return `${this.process({url: srcParts[0]})} ${srcParts[1]} ${srcParts[2]}`;
			default:
				console.warn('Can not process image srcset: ' + src);
				return src;
		}
	}).join(', ');
}
