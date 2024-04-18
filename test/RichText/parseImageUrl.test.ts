import {
	describe,
	expect,
	test as it
} from '@jest/globals';
import {parseImageUrl} from './parseImageUrl';


describe('parseImageUrl', () => {
	it('should parse a relative imageUrl', () => {
		expect(parseImageUrl({
			imageUrl: '/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/width-768/example.jpg'
		})).toEqual({
			'admin': 'admin',
			'background': undefined,
			'branch': 'draft',
			'filename': 'example.jpg',
			'filter': undefined,
			'host': undefined,
			'id': 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8',
			'mode': 'preview',
			'params': {},
			'port': undefined,
			'project': 'richproject',
			'quality': undefined,
			'scale': 'width(768)',
			'scheme': undefined,
			'type': undefined,
			'versionKey': '9abf6cc6c7f565515175b33c08155b3495dcdf47',
		})
	});

	it('should parse an absolute imageUrl', () => {
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
		});
	});

	it('should handle block scaling', () => {
		expect(parseImageUrl({
			imageUrl: '/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/block-1-2/example.jpg'
		})).toEqual({
			'admin': 'admin',
			'background': undefined,
			'branch': 'draft',
			'filename': 'example.jpg',
			'filter': undefined,
			'host': undefined,
			'id': 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8',
			'mode': 'preview',
			'params': {},
			'port': undefined,
			'project': 'richproject',
			'quality': undefined,
			'scale': 'block(1,2)',
			'scheme': undefined,
			'type': undefined,
			'versionKey': '9abf6cc6c7f565515175b33c08155b3495dcdf47',
		});
	});

	it('should handle full scaling', () => {
		expect(parseImageUrl({
			imageUrl: '/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/full/example.jpg'
		})).toEqual({
			'admin': 'admin',
			'background': undefined,
			'branch': 'draft',
			'filename': 'example.jpg',
			'filter': undefined,
			'host': undefined,
			'id': 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8',
			'mode': 'preview',
			'params': {},
			'port': undefined,
			'project': 'richproject',
			'quality': undefined,
			'scale': 'full',
			'scheme': undefined,
			'type': undefined,
			'versionKey': '9abf6cc6c7f565515175b33c08155b3495dcdf47',
		});
	});

	it('should handle custom url query params', () => {
		expect(parseImageUrl({
			imageUrl: '/admin/site/preview/richproject/draft/_/image/e9b1f92b-fa46-4e58-b41f-87dc9f1999e8:9abf6cc6c7f565515175b33c08155b3495dcdf47/height-300/example.jpg?justKey&key=value&sameKey=0&sameKey=1&sameKey=2'
		})).toEqual({
			'admin': 'admin',
			'background': undefined,
			'branch': 'draft',
			'filename': 'example.jpg',
			'filter': undefined,
			'host': undefined,
			'id': 'e9b1f92b-fa46-4e58-b41f-87dc9f1999e8',
			'mode': 'preview',
			'params': {
				justKey: '',
				key: 'value',
				sameKey: ['0', '1', '2'],
			},
			'port': undefined,
			'project': 'richproject',
			'quality': undefined,
			'scale': 'height(300)',
			'scheme': undefined,
			'type': undefined,
			'versionKey': '9abf6cc6c7f565515175b33c08155b3495dcdf47',
		});
	});

	it('should throw when no path in imageUrl', () => {
		expect(() => parseImageUrl({
			imageUrl: ''
		})).toThrow('parseImageUrl: No path in imageUrl: !');
	});
});
