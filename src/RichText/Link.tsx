import type {LinkComponentParams} from '../types';


export const Link = ({
    data: _data,
    content: _content,
    media: _media,
    uri: _uri,
    ...aProps
}: LinkComponentParams) => {

    return <a {...aProps} />;
}
