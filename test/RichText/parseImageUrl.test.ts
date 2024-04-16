import {
	describe,
	expect,
	test as it
} from '@jest/globals';
import {parseImageUrl} from '../../src/RichText/parseImageUrl';


describe('parseImageUrl', () => {
	it('should parse an imageUrl', () => {
		expect(parseImageUrl({
			imageUrl: 'http://localhost:8080/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg.png?background=ff0000&filter=rounded%285%29%3Bsharpen%28%29&quality=80'
		})).toEqual({
			'admin': 'admin',
			'background': 'ff0000',
			'branch': 'draft',
			'filename': 'example.jpg.png',
			'filter': 'rounded(5);sharpen()',
			'host': 'localhost',
			'id': 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8',
			'mode': 'preview',
			'params': {},
			'port': 8080,
			'project': 'richproject',
			'quality': 80,
			'scale': 'width(768)',
			'scheme': 'http',
			'type': 'absolute',
			'versionKey': '9abf6cc6c7f565515175b33c08155b3495dcdf47',
		})
	});
});
