export interface ComponentDefinitionParams<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export interface ComponentDefinition<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export type ComponentDictionary<PROPS = {}> = Record<string, ComponentDefinition<PROPS>>;

export interface ComponentRegistry {
	addMacro<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addLayout<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPage<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPart<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	getMacro<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getLayout<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPage<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPart<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	hasMacro(name: string): boolean
	hasLayout(name: string): boolean
	hasPage(name: string): boolean
	hasPart(name: string): boolean
}
