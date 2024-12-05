export interface ComponentDefinitionParams<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export interface ComponentDefinition<PROPS = {}> {
	View: React.FunctionComponent<PROPS>
}

export type ComponentDictionary<PROPS = {}> = Record<string, ComponentDefinition<PROPS>>;

export interface ComponentRegistry {
	addContentType<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addMacro<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addLayout<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPage<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	addPart<PROPS = {}>(name: string, obj: ComponentDefinitionParams<PROPS>): void
	getContentType<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getMacro<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getLayout<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPage<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	getPart<PROPS = {}>(name: string): ComponentDefinition<PROPS> | undefined
	hasContentType(name: string): boolean
	hasMacro(name: string): boolean
	hasLayout(name: string): boolean
	hasPage(name: string): boolean
	hasPart(name: string): boolean
}
