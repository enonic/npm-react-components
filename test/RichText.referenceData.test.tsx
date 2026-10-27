import type {
    ImageComponent,
    ImageData,
    LinkComponent,
    LinkData,
    PartData,
    RichTextData,
    RichTextMetaData
} from '../src';

import {afterEach, describe, expect, jest, test} from '@jest/globals';
import {cleanup, render, waitFor} from '@testing-library/react';
import React from 'react';
import {RichText} from '../src';

const meta: RichTextMetaData = {type: 'example', id: 'example', path: '/example', mode: 'inline'};
const component: PartData = {type: 'part', path: '/main/0', descriptor: 'example:part'};

afterEach(cleanup);

describe('RichText reference data', () => {
    test('forwards structured image data unchanged and retains HTML attributes', async () => {
        const imageData: ImageData = {
            ref: 'photo',
            image: null,
            src: {path: '/photo.jpg', queryString: '?size=large'},
            srcset: [{width: 400, imageUrl: {path: '/small.jpg'}}],
            style: {application: 'example', name: 'portrait', aspectRatio: '1:1', filter: ''}
        };
        const data: RichTextData = {
            processedHtml: '<img data-image-ref="photo" src="placeholder" srcset="placeholder 400w" alt="Photo" sizes="100vw" style="width:100%"/>',
            images: [imageData]
        };
        const Image: ImageComponent = (props) => {
            expect(props.data).toBe(imageData);
            expect(props).not.toHaveProperty('imageData');
            expect(props.image).toBe(imageData.image);
            expect(props.imageStyle).toBe(imageData.style);
            expect(props.data?.image).toBeNull();
            expect(props.data?.style).toBe(imageData.style);
            expect(props.style).toEqual({width: '100%'});
            expect(props.src).toBe('placeholder');
            expect(props.srcSet).toBe('placeholder 400w');
            expect(props.sizes).toBe('100vw');
            return <img src="/resolved-by-consumer.jpg" alt={props.alt}/>;
        };
        const {container} = render(<RichText data={data} meta={meta} component={component} Image={Image}/>);
        await waitFor(() => expect(container.querySelector('img')?.getAttribute('src')).toBe('/resolved-by-consumer.jpg'));
        expect(data.images?.[0]).toBe(imageData);
    });

    test('forwards complete page and media link entries without resolving their URLs', async () => {
        const links: LinkData[] = [{
            ref: 'page',
            uri: 'reference:page',
            pageUrl: {baseUrl: null, path: '/page', queryString: '?a=1'},
            fragment: '#details',
            content: null
        }, {
            ref: 'file',
            uri: 'reference:file',
            pageUrl: null,
            media: {content: null, intent: 'download', mediaUrl: {path: '/file.pdf', queryString: '?download'}}
        }, {
            ref: 'missing',
            uri: 'reference:missing',
            pageUrl: null,
            media: null,
            content: null
        }];
        const seen = jest.fn();
        const Link: LinkComponent = (props) => {
            const {data, href, children} = props;
            expect(props).not.toHaveProperty('linkData');
            expect(props.content).toBe(data?.content);
            expect(props.media).toBe(data?.media);
            expect(props.uri).toBe(data?.uri);
            seen(data, href);
            return <a href="/resolved-by-consumer">{children}</a>;
        };
        const data: RichTextData = {
            processedHtml: links.map(link => `<a data-link-ref="${link.ref}" href="placeholder">${link.ref}</a>`).join(''),
            links
        };
        const {container} = render(<RichText data={data} meta={meta} component={component} Link={Link}/>);
        await waitFor(() => expect(container.querySelectorAll('a')).toHaveLength(3));
        for (const link of links) {
            expect(seen).toHaveBeenCalledWith(link, 'placeholder');
            expect(seen.mock.calls.some(([entry]) => entry === link)).toBe(true);
        }
    });

    test('distinguishes ordinary HTML links from referenced links with unresolved data', async () => {
        const seen = jest.fn();
        const Link: LinkComponent = ({data, content, media, uri, href, children}) => {
            seen(data);
            expect(content).toBeUndefined();
            expect(media).toBeUndefined();
            expect(uri).toBe(href);
            return <a href={href}>{children}</a>;
        };
        const data: RichTextData = {processedHtml: '<a href="https://example.org">External</a>'};
        const {container} = render(<RichText data={data} meta={meta} component={component} Link={Link}/>);
        await waitFor(() => expect(container.querySelector('a')?.getAttribute('href')).toBe('https://example.org'));
        expect(seen).toHaveBeenCalledWith(undefined);
    });

    test('keeps legacy renderers working alongside the new data API', async () => {
        const imageContent = {_id: 'photo'};
        const imageStyle = {name: 'portrait', aspectRatio: '1:1', filter: ''};
        const pageContent = {_id: 'page', _name: 'page'};
        const mediaData: NonNullable<LinkData['media']> = {content: {_id: 'file'}, intent: 'download'};
        const data: RichTextData = {
            processedHtml: '<a data-link-ref="page" href="/from-html">Page</a><a data-link-ref="file" href="/file.pdf">File</a><img data-image-ref="photo" src="/from-html.jpg"/>',
            links: [
                {ref: 'page', uri: 'reference:page', content: pageContent},
                {ref: 'file', uri: 'reference:file', media: mediaData}
            ],
            images: [{ref: 'photo', image: imageContent, style: imageStyle}]
        };
        const Image: ImageComponent = ({image, imageStyle: style, src}) => {
            expect(image).toBe(imageContent);
            expect(style).toBe(imageStyle);
            return <img src={src} data-content-id={image?._id}/>;
        };
        const Link: LinkComponent = ({content, media, uri, href, children}) => {
            if (content) {
                expect(content).toBe(pageContent);
                expect(uri).toBe('reference:page');
            } else {
                expect(media).toBe(mediaData);
                expect(uri).toBe('reference:file');
            }
            return <a href={href}>{children}</a>;
        };
        const {container} = render(<RichText data={data} meta={meta} component={component} Image={Image} Link={Link}/>);
        await waitFor(() => {
            expect(container.querySelector('img')?.getAttribute('data-content-id')).toBe('photo');
            expect(container.querySelector('a')?.getAttribute('href')).toBe('/from-html');
            expect(container.querySelectorAll('a')[1]?.getAttribute('href')).toBe('/file.pdf');
        });
    });

    test('does not leak reference data into default component HTML', async () => {
        const data: RichTextData = {
            processedHtml: '<a data-link-ref="page" href="/from-html"><img data-image-ref="photo" src="/from-html.jpg"/></a>',
            links: [{ref: 'page', uri: 'reference:page', content: {_id: 'page'}, media: {content: {_id: 'file'}, intent: 'inline'}, pageUrl: '/from-data', fragment: '#details'}],
            images: [{ref: 'photo', image: {_id: 'photo'}, style: {name: 'portrait', aspectRatio: '1:1', filter: ''}, src: '/from-data.jpg', srcset: []}]
        };
        const {container} = render(<RichText data={data} meta={meta} component={component}/>);
        await waitFor(() => expect(container.querySelector('img')?.getAttribute('src')).toBe('/from-html.jpg'));
        expect(container.querySelector('a')?.getAttribute('href')).toBe('/from-html');
        expect(container.innerHTML).not.toMatch(/linkdata|imagedata|imagestyle|pageurl|\[object Object\]/i);
                for (const attribute of ['data', 'content', 'media', 'uri']) {
                    expect(container.querySelector('a')?.hasAttribute(attribute)).toBe(false);
                }
    });
});
