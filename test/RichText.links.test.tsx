import {LinkComponent, RichTextData} from '../src/types';


import {beforeAll, afterAll, describe, expect, test as it} from '@jest/globals';
import {render, waitFor} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
import React from 'react';
import {RichText} from '../src';
import {Link} from '../src/RichText/Link';
import {ERROR_STYLE} from './testdata';
import {METADATA, COMPONENT} from './RichText.test';

const IMG_ID = 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8'
const IMG_VERSION_KEY = '9abf6cc6c7f565515175b33c08155b3495dcdf47';

const FOLDER_ID = '73fb7dd4-b483-428e-968e-690ca65b11d8';
const FOLDER_REF = '8c5593b8-fe2f-47d0-a7fa-472be74a2ae5';


const originalError = console.error
beforeAll((done) => {
    console.error = (...args) => {
        if (
            args[0] === 'Warning: validateDOMNesting(...): %s cannot appear as a descendant of <%s>.%s'
            && args[1] === '<div>'
            && args[2] === 'p'
        ) {
            return;
        }
        if (
            typeof args[0] === 'object'
            && args[0].detail instanceof Error
            && args[0].detail.message === 'Failed to build href!'
        ) {
            return;
        }
        console.debug(args[0].detail.message); // For some this line makes an error go away!?!
        originalError(...args)
    }
    done();
});

afterAll((done) => {
    console.error = originalError;
    done();
});

describe('RichText', () => {
    it('should remove data-link-ref from links to open or download media', () => {
        const LINK_REF1 = '7c68ab3a-689b-45d0-9043-10067598af0c';
        const LINK_REF2 = 'fc7ef744-02b8-4518-b3bb-50c021a54ac5';
        const data: RichTextData = {
            links: [{
                content: null,
                ref: LINK_REF1,
                uri: `media://inline/${IMG_ID}`
            }, {
                content: null,
                ref: LINK_REF2,
                uri: `media://download/${IMG_ID}`
            }],
            processedHtml: `<p>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/inline/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"open file tooltip\" data-link-ref=\"${LINK_REF1}\">open file text</a>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/download/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"download file tooltip\" data-link-ref=\"${LINK_REF2}\">download file text</a>
</p>`
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Link={Link}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });
        waitFor(() => {
            expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/inline/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"open file tooltip\">open file text</a>
	<a href=\"/admin/site/preview/richproject/draft/_/attachment/download/${IMG_ID}:${IMG_VERSION_KEY}/example.jpg\" title=\"download file tooltip\">download file text</a>
</p></section></div></body>`);
        });
    });

    it('should show an ErrorComponent when the Link component throws', () => {
        const LinkThatThrows: LinkComponent = () => {
            throw new Error('Failed to build href!');
        }
        const linkRef = '33a61455-d4b0-4ed0-bae3-d707d00d35f2';
        const data: RichTextData = {
            links: [{
                content: {
                    _id: "73fb7dd4-b483-428e-968e-690ca65b11d8",
                    _name: "myfolder",
                    _path: "/mysite/myfolder",
                    type: "base:folder"
                },
                // media: null,
                ref: linkRef,
                uri: 'content://73fb7dd4-b483-428e-968e-690ca65b11d8?query=key%3Dvalue&fragment=anchor'
            }],
            processedHtml: `<a href=\"http://localhost:8080/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${linkRef}\">link text</a>`
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            mode="inline"
            Link={LinkThatThrows}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });

        waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><div style="${ERROR_STYLE}">Failed to build href!</div></section></div></body>`);
        });
    });

    it('should handle links', () => {
        const data: RichTextData = {
            links: [{
                content: {
                    _id: FOLDER_ID,
                    _name: 'myfolder',
                    _path: '/mysite/myfolder',
                    type: 'base:folder'
                },
                ref: FOLDER_REF,
                uri: `content://${FOLDER_ID}?query=key%3Dvalue&fragment=anchor`
            }],
            processedHtml: `<p><a href=\"/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${FOLDER_REF}\">link text</a></p>
<p><a href=\"mailto:email@example.com?subject=Subject\" title=\"Tooltip\">Text</a></p>
<p><a href=\"https://www.example.com\" target=\"_blank\" title=\"Tooltip\">Text</a></p>`
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Link={Link}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });
        waitFor(() => {
            expect(html.outerHTML).toBe(`<body><div><section class="myclass"><p><a href="/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor" target="_blank" title="link tooltip">link text</a></p>
<p><a href="mailto:email@example.com?subject=Subject" title="Tooltip">Text</a></p>
<p><a href="https://www.example.com" target="_blank" title="Tooltip">Text</a></p></section></div></body>`);
        });
    });

    it('should show an ErrorComponent when the link element has data-link-ref but no href', () => {
        const linkRef = '33a61455-d4b0-4ed0-bae3-d707d00d35f2';
        const data: RichTextData = {
            links: [{
                content: {
                    _id: "73fb7dd4-b483-428e-968e-690ca65b11d8",
                    _name: "myfolder",
                    _path: "/mysite/myfolder",
                    type: "base:folder"
                },
                // media: null,
                ref: linkRef,
                uri: 'content://73fb7dd4-b483-428e-968e-690ca65b11d8?query=key%3Dvalue&fragment=anchor'
            }],
            processedHtml: `<a data-link-ref=\"${linkRef}\">link text</a>`
        }
        const html = render(<RichText
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Link={Link}
        />).baseElement;

        waitFor(() => {
            expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section>
      <div style="${ERROR_STYLE}">
        Link element has no href attribute!
      </div>
    </section>
  </div>
</body>
`);
        });
    });

    it('should show an ErrorComponent when the links object is missing or empty', () => {
        const linkRef = '33a61455-d4b0-4ed0-bae3-d707d00d35f2';
        const data: RichTextData = {
            // links: [], // Should be missing or empty, in this test :)
            processedHtml: `<a href=\"http://localhost:8080/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${linkRef}\">link text</a>`
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Link={Link}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });
        waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><div style="${ERROR_STYLE}">Can't replace link, when there are no links in the data object!</div></section></div></body>`);
        });
    });

    it("should show an ErrorComponent when the linkRef can't be found in the links object", () => {
        const linkRef = '33a61455-d4b0-4ed0-bae3-d707d00d35f2';
        const data: RichTextData = {
            links: [{
                content: {
                    _id: "73fb7dd4-b483-428e-968e-690ca65b11d8",
                    _name: "myfolder",
                    _path: "/mysite/myfolder",
                    type: "base:folder"
                },
                // media: null,
                ref: 'wrong-link-ref',
                uri: 'content://73fb7dd4-b483-428e-968e-690ca65b11d8?query=key%3Dvalue&fragment=anchor'
            }],
            processedHtml: `<a href=\"http://localhost:8080/admin/site/preview/richproject/draft/mysite/myfolder?key=value#anchor\" target=\"_blank\" title=\"link tooltip\" data-link-ref=\"${linkRef}\">link text</a>`
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Link={Link}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });
        waitFor(() => {
            expect(html.outerHTML).toBe(
                `<body><div><section class="myclass"><div style="${ERROR_STYLE}">Unable to find link with ref ${linkRef} in links object!</div></section></div></body>`);
        });
    });
}); // describe RichText
