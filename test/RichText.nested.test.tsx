import {RichTextData} from '../src/types';


import {describe, expect, test as it} from '@jest/globals';
import {render, waitFor} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
import React from 'react';
import {RichText} from '../src';
import {Image} from '../src/RichText/Image';
import {Link} from '../src/RichText/Link';
import {METADATA, COMPONENT} from './RichText.test';


describe('RichText', () => {
    it('should handle image nested inside link', async () => {
        const data: RichTextData = {
            "images": [{
                "image": {
                    "_id": "e9b1f92b-fa46-4e58-b41f-87dc9f1999e8",
                    "_path": "/mysite/example.jpg",
                    "imageUrl": "http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-1024/example.jpg"
                },
                "ref": "3c251280-49c3-4c44-ab29-9958f7c9a9e3",
                "style": null
            }],
            "links": [{
                "content": {
                    "_id": "73fb7dd4-b483-428e-968e-690ca65b11d8",
                    "_name": "myfolder",
                    "_path": "/mysite/myfolder",
                    "type": "base:folder"
                },
                "media": null,
                "ref": "e551d21d-00ac-4e1f-810b-f42471bae4dd",
                "uri": "content://73fb7dd4-b483-428e-968e-690ca65b11d8?query=key%3Dvalue1%26key%3Dvalue2&fragment=anchor2"
            }],
            "processedHtml": "<figure class=\"captioned editor-align-right editor-width-custom\" style=\"float: right; width: 50%;\"><a href=\"http://localhost:8080/admin/site/preview/richproject/draft/mysite/myfolder?key=value1&amp;key=value2#anchor2\" target=\"_blank\" title=\"blablabla\" data-link-ref=\"e551d21d-00ac-4e1f-810b-f42471bae4dd\"><img alt=\"Alt text\" src=\"http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg\" style=\"width:100%\" srcset=\"http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-2048/example.jpg 2048w,http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-1024/example.jpg 1024w\" sizes=\"juhu\" data-image-ref=\"3c251280-49c3-4c44-ab29-9958f7c9a9e3\"></a>\n<figcaption>Caption</figcaption>\n</figure>\n"
        }
        const html = render(<RichText
            className="myclass"
            data={data}
            meta={METADATA}
            component={COMPONENT}
            Image={Image}
            Link={Link}
        />).baseElement;
        // print(html.outerHTML, { maxItems: Infinity });
        waitFor(() => {
            expect(toDiffableHtml(html.outerHTML)).toBe(`
<body>
  <div>
    <section class=\"myclass\">
      <figure
        class=\"captioned editor-align-right editor-width-custom\"
        style=\"float: right; width: 50%;\"
      >
        <a
          href=\"http://localhost:8080/admin/site/preview/richproject/draft/mysite/myfolder?key=value1&amp;key=value2#anchor2\"
          target=\"_blank\"
          title=\"blablabla\"
        >
          <img
            alt="Alt text"
            sizes="juhu"
            src="http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg"
            srcset="http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-2048/example.jpg 2048w,http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-1024/example.jpg 1024w"
            style="width: 100%;"
          >
        </a>
        <figcaption>
          Caption
        </figcaption>
      </figure>
    </section>
  </div>
</body>
`);
        });
    });

}); // describe RichText
