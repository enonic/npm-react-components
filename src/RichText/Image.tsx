import type {ImageComponentParams} from '../types';


export const Image = ({
    alt,
    sizes,
    src,
    srcSet,
    style
}: ImageComponentParams) => {
    const imgProps = {alt, sizes, src, srcSet, style};
    return <img {...imgProps} />;
}
