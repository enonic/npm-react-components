import type {ImageComponent} from '../../src/types';


export const Image: ImageComponent = ({
	alt,
	// image,
	// imageStyle,
	sizes,
	src,
	srcSet,
	style,
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
	const imgProps = {alt, sizes, src, srcSet, style};
	return <img {...imgProps} />;
}
