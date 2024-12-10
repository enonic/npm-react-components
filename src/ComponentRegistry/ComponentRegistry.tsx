import type {
	ComponentDefinition,
	ComponentDefinitionParams,
	ComponentDictionary,
	ComponentRegistry as ComponentRegistryInterface
} from '../types';

// import {XP_COMPONENT_TYPE} from './constants';

export class ComponentRegistry implements ComponentRegistryInterface {

	private _contentTypes: ComponentDictionary = {};
    private _pages: ComponentDictionary = {};
    private _parts: ComponentDictionary = {};
    private _layouts: ComponentDictionary = {};
    private _macros: ComponentDictionary = {};

	public addContentType<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void {
        this._contentTypes[name] = obj as ComponentDefinition<{}>;
    }

	public addMacro<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void {
		this._macros[name] = obj as ComponentDefinition<{}>;
    }

    public addLayout<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void {
        this._layouts[name] = obj as ComponentDefinition<{}>;
    }

    public addPage<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void {
        this._pages[name] = obj as ComponentDefinition<{}>;
    }

    public addPart<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void {
        this._parts[name] = obj as ComponentDefinition<{}>;
    }

	public getContentType<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined {
		return this._contentTypes[name] as ComponentDefinition<PROPS>;
    }

	public getLayout<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined {
		return this._layouts[name] as ComponentDefinition<PROPS>;
    }

    public getMacro<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined {
		return this._macros[name] as ComponentDefinition<PROPS>;
    }

    public getPage<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined {
		return this._pages[name] as ComponentDefinition<PROPS>;
    }

    public getPart<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined {
        return this._parts[name] as ComponentDefinition<PROPS>;
    }

	public hasContentType(name: string): boolean {
		return this._contentTypes[name] !== undefined;
	}

	public hasMacro(name: string): boolean {
		return this._macros[name] !== undefined;
	}

	public hasLayout(name: string): boolean {
		return this._layouts[name] !== undefined;
	}

	public hasPage(name: string): boolean {
		return this._pages[name] !== undefined;
	}

	public hasPart(name: string): boolean {
		return this._parts[name] !== undefined;
	}
}
