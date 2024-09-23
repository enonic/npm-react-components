import type {LinkComponentParams} from '../types';


// import {parse} from 'uri-js';


export const Link = ({
    // children, // in aProps
    content: _content,
    media: _media,
    // href, // in aProps
    // target, // in aProps
    // title, // in aProps
    uri: _uri,
    ...aProps
}: LinkComponentParams) => {
    // const {
    // 	content: mediaContent,
    // 	intent,
    // } = media || {} as LinkDataMedia;

    // const {
    // 	_id,
    // 	_name,
    // 	_path,
    // 	imageUrl,
    // 	mediaUrl,
    // 	type,
    // } = mediaContent || content;

    // const hrefObj = parse(href);
    // console.debug('hrefObj', hrefObj);

    // const uriObj = parse(uri);
    // console.debug('uriObj', uriObj);

    return <a {...aProps} />;
}
