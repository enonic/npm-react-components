import type {RegionsProps} from '../src/Regions';
import type {MacroComponent} from '../src/types';

import {
	// beforeAll,
	// afterAll,
	describe,
	expect,
	test as it
} from '@jest/globals';
import {render} from '@testing-library/react'
import toDiffableHtml from 'diffable-html';
// import {print} from 'q-i';
import React from 'react';

import {ComponentRegistry} from '../src/ComponentRegistry';
// import Regions from '../../src/Regions';
import {RichText} from '../src/RichText';
import {replaceMacroComments} from '../src/replaceMacroComments';


interface InfoPanelMacroProps {
	body: string
	header: string
}

function InfoPanelMacro({
	body,
	header,
}: InfoPanelMacroProps) {
	return <div className="macro-panel macro-panel-info macro-panel-styled"><i className="icon"></i><strong>{header}</strong>{body}</div>;
}

const emptyComponentRegistry = new ComponentRegistry;

const componentRegistry = new ComponentRegistry;

componentRegistry.addMacro<InfoPanelMacroProps>('info', InfoPanelMacro);

const PROCESSED_HTML = `<p><a href=\"/admin/site/preview/myproject/draft/mysite\" title=\"Tooltip\">Home</a></p>

<figure class=\"editor-align-justify\">
	<img
		alt=\"jubalong\"
		src=\"/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-768/Example.png\"
		style=\"width:100%\" srcset=\"/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-320/Example.png 320w,/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-1920/Example.png 1920w,/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-640/Example.png 640w,/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-960/Example.png 960w,/admin/site/preview/myproject/draft/mysite/macro/_/image/30a6f8fb-52a4-4867-8e84-640d676131f8:1a1b619277e322ce3041067471b1fe3f3c7369b3/width-1280/Example.png 1280w\"
	>
	<figcaption>Caption</figcaption>
</figure>
<p><!--#MACRO _name=\"info\" header=\"Header1\" _document=\"__macroDocument1\" _body=\"Text1\" --></p>
<p><!--#MACRO _name=\"info\" header=\"Header2\" _document=\"__macroDocument1\" _body=\"Text2\" --></p>`;

const REGIONS_PROPS: RegionsProps = {
	names: "main",
	regionsData: {
		main: {
			components: [{
				path: '/main/0',
				type: 'text',
				// text: `
				// 	<p><a href="content://3e36f69a-fa2f-4943-a812-5a2d06f22e56" title="Tooltip">Home</a></p>

				// 	<figure class="editor-align-justify">
				// 		<img alt="jubalong" src="image://30a6f8fb-52a4-4867-8e84-640d676131f8" style="width:100%" />
				// 		<figcaption>Caption</figcaption>
				// 	</figure>

				// 	<p>[info header="Header"]Text[/info]</p>
				// `,
				text: PROCESSED_HTML,
			}],
			name: 'main'
		}
	},
	tags: "main",
	classes: "aCssClass"
};

// const Macro: MacroComponent<RestProps> = ({
// 	componentRegistry,
// 	config,
// 	descriptor,
// 	children
// }) => {
// 	console.info('MacroWithComponentRegistry', {config, descriptor, children});
// 	if (componentRegistry) {
// 		const macroName = descriptor.includes(':') ? descriptor.split(':')[1] : descriptor;
// 		const MacroComponent = componentRegistry.getMacro(macroName);
// 		if (!MacroComponent) {
// 			console.error(`Component Registry doesn't have a macro named: ${macroName}!, keeping processedHtml as is.`);
// 			return null;
// 		}
// 		return (
// 			<MacroComponent {...config}/>
// 		);
// 	}
// 	return null;
// }

describe('ComponentRegistry', () => {
	// it('should fallback to component comment when no component registry', () => {
	// 	const html = render(<Regions {...REGIONS_PROPS} />).container;
	// 	// print(html.outerHTML, { maxItems: Infinity });
	// 	expect(html.outerHTML).toBe(`<div><main data-portal-region=\"main\" class=\"xp-region aCssClass\">\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!--# COMPONENT /main/0 -->\t\t\t\t\t\n</main></div>`);
	// });

	// it('should fallback to component comment when component registry is empty', () => {
	// 	const html = render(<Regions {...{...REGIONS_PROPS, emptyComponentRegistry}} />).container;
	// 	// print(html.outerHTML, { maxItems: Infinity });
	// 	expect(html.outerHTML).toBe(`<div><main data-portal-region=\"main\" class=\"xp-region aCssClass\">\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<!--# COMPONENT /main/0 -->\t\t\t\t\t\n</main></div>`);
	// });

	it('should use component registry when passed', () => {
		const data = replaceMacroComments(PROCESSED_HTML);
		// console.info('data', data);

		const element = render(<RichText
			componentRegistry={componentRegistry}
			data={data}
		/>).container;
		expect(toDiffableHtml(element.outerHTML)).toEqual(`
<div>
  <section>
    <p>
      <a
        href="/admin/site/preview/myproject/draft/mysite"
        title="Tooltip"
      >
        Home
      </a>
    </p>
    <figure class="editor-align-justify">
      <div style="border: 1px dotted red; color: red;">
        Can't replace image, when there are no images in the data object!
      </div>
      <figcaption>
        Caption
      </figcaption>
    </figure>
    <p>
      <div class=\"macro-panel macro-panel-info macro-panel-styled\">
        <i class=\"icon\">
        </i>
        <strong>
          Header1
        </strong>
        Text1
      </div>
    </p>
    <p>
      <div class=\"macro-panel macro-panel-info macro-panel-styled\">
        <i class=\"icon\">
        </i>
        <strong>
          Header2
        </strong>
        Text2
      </div>
    </p>
  </section>
</div>
`);

		// const props = {...REGIONS_PROPS, componentRegistry};
		// // print(props, { maxItems: Infinity });
		// const regions = render(<Regions {...props} />).container;
		// expect(regions?.outerHTML).toEqual(`<div><main data-portal-region="main" class="xp-region aCssClass"></main></div>`);
	});
}); // describe
