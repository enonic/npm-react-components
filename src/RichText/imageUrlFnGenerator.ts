import type {get as getContent} from '@enonic-types/lib-content';
import type {RepoConnection} from '@enonic-types/lib-node';
import type {ImageUrlParams} from '@enonic-types/lib-portal';


const DEBUG = false;


export declare interface QueryParams {
	background?: string
	filter?: string
	quality?: string
	[key: string]: string|undefined
}

// https://developer.enonic.com/docs/xp/stable/runtime/engines/site-engine/image-service
export function imageUrlFnGenerator({
	basePath,
	getContentFn,
	getNodeFn,
	host,
	port,
	scheme = 'https'
}: {
	basePath: string
	getContentFn: typeof getContent,
	getNodeFn: RepoConnection['get'],
	host: string
	port?: number,
	scheme?: string
}) {
	const absPrefix = `${scheme}://${host}${port ? `:${port}` : ''}`;
	return ({
		// Required
		scale,
		// One of these are required
		id,
		path,
		// Optional
		quality,
		background,
		format,
		filter,
		params: urlParams,
		type,
	}: ImageUrlParams): string => {
		const key = id || path;

		if (!key) {
			throw new Error('imageUrl(): Either id or path must be set!');
		}

		const imageContent = getContentFn({key});
		if (!imageContent) {
			throw new Error(`imageUrl(): No imageContent with key:${key}`);
		}
		const {
			_id,
			_name,
		} = imageContent;
		if (!_id) {
			throw new Error(`imageUrl(): getContent({key: ${key}}) returned content without _id!`);
		}
		if (!_name) {
			throw new Error(`imageUrl(): getContent({key: ${key}}) returned content without _name!`);
		}

		const imageNode = getNodeFn(_id);
		if (!imageNode) {
			throw new Error(`imageUrl(): No imageNode with _id:${_id}!`);
		}
		const {
			_versionKey
		} = imageNode;
		if (!_versionKey) {
			throw new Error(`imageUrl(): getNode(${_id}}) returned node without _versionKey!`);
		}

		// Possible scales:
		// `block(${widthNumber},${heightNumber})`
		// `height(${number})`
		// `max(${number})`
		// `square(${number})`
		// `wide(${number},${number})`
		// `width(${number})`
		// 'full'
		const s = scale
			.replace(/[\(,]/g, '-') // start parenthesis and comma with hyphen
			.replace(/\)/, '') // Last end parenthesis with nothing

		const queryParams: QueryParams = urlParams as Record<string, string> || {};

		if (background) {
			queryParams.background = background; // ff0000 | f00
		}

		if (filter) {
			queryParams.filter = filter; // rounded(5);sharpen() ...
		}

		const f = format ? `.${format}` : '';

		if (quality) {
			queryParams.quality = `${quality}`; // Converting number to string to match type for URLSearchParams
		}
		DEBUG && console.debug('imageUrl() queryParams', queryParams);

		const query = Object.values(queryParams).length ? `?${new URLSearchParams(queryParams as Record<string, string>).toString()}` : '';
		const urlPathAndQuery = `${basePath}/_/image/${_id}:${_versionKey}/${s}/${_name}${f}${query}`;

		if (type !== 'absolute') {
			return urlPathAndQuery;
		}

		return `${absPrefix}${urlPathAndQuery}`;
	}
}
