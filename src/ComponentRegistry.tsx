import type {ComponentRegistry as ComponentRegistryInterface} from './types';

// import {XP_COMPONENT_TYPE} from './constants';

export class ComponentRegistry implements ComponentRegistryInterface {

    // private pages: ComponentDictionary = {};
    // private parts: ComponentDictionary = {};
    // private layouts: ComponentDictionary = {};
    private _macros: {[macroName: string]: React.FunctionComponent<any>} = {};

    public addMacro<PROPS = {}>(name: string, component: React.FunctionComponent<PROPS>): React.FunctionComponent<PROPS> {
		this._macros[name] = component;
		return this._macros[name];
    }

    // public addLayout(name: string, obj: ComponentDefinitionParams): void {
    //     return ComponentRegistry.addType('layout', name, obj);
    // }

    // public addPage(name: string, obj: ComponentDefinitionParams): void {
    //     return ComponentRegistry.addType('page', name, obj);
    // }

    // public addPart(name: string, obj: ComponentDefinitionParams): void {
    //     return ComponentRegistry.addType('part', name, obj);
    // }

    public getMacro<PROPS = {}>(name: string): React.FunctionComponent<PROPS> | undefined {
		return this._macros[name];
    }

    // public getPage(name: string): ComponentDefinition | undefined {
    //     return ComponentRegistry.getType('page', name);
    // }

    // public getPart(name: string): ComponentDefinition | undefined {
    //     return ComponentRegistry.getType('part', name);
    // }

    // public getLayout(name: string): ComponentDefinition | undefined {
    //     return ComponentRegistry.getType('layout', name);
    // }

	public hasMacro(name: string): boolean {
		return this._macros[name] !== undefined;
	}
}
