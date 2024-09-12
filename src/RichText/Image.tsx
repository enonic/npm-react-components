import type {ImageComponentParams} from '../types';


export const Image = ({
    alt,
    // image,
    // imageStyle,
    sizes,
    src,
    srcSet,
    style
}: ImageComponentParams) => {
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
    const imgProps = {alt, sizes, src, srcSet, style};
    return <img {...imgProps} />;
}
