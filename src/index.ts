export type {
	ContentUri,
	ImageComponent,
	ImageComponentParams,
	ImageContent,
	ImageData,
	ImageStyle,
	LinkComponent,
	LinkComponentParams,
	LinkData,
	LinkDataMedia,
	MacroComponent,
	MacroComponentParams,
	MacroConfig,
	MacroData,
	MacroDescriptor,
	MediaUri,
	Replacer,
	ReplacerResult,
	RichtextContent,
	RichTextData,
	RichTextParams,
} from './types';

import Layout from './Layout'
import Page from './Page'
import ComponentTag from './ComponentTag';
import Region from './Region';
import Regions from './Regions';

export {
	ComponentTag,
	Layout,
	Page,
	Region,
	Regions,
};
export { ComponentRegistry } from './ComponentRegistry';
export { XpComponent } from './ComponentRegistry/XpComponent';
export { XpLayout } from './ComponentRegistry/XpLayout';
export { XpPage } from './ComponentRegistry/XpPage';
export { XpPart } from './ComponentRegistry/XpPart';
export { XpRegions } from './ComponentRegistry/XpRegions';

// Exporting processComponents here is a bad idea, because it's should be used in Enonic XP nashorn.
// Nashorn throws "Invalid hex digit" because entities contains Uint16Array.
// export { ComponentProcessor } from './ComponentProcessor';

export { replaceMacroComments } from './replaceMacroComments';
export { RichText } from './RichText';
export { cssToReactStyle } from './RichText/cssToReactStyle';
export {sanitizeGraphqlName} from './utils/sanitizeGraphqlName';
