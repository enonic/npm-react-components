import type { MacroComponentParams } from '../types';

export function Macro({
	componentRegistry,
	config,
	descriptor,
}: MacroComponentParams) {
	let msg = 'No Macro component provided to RichText.';
	if (componentRegistry) {
		const macroName = descriptor.includes(':') ? descriptor.split(':')[1] : descriptor;
		if (!componentRegistry.hasMacro(macroName)) {
			msg = `Component Registry doesn't have a macro named: ${macroName}!, keeping processedHtml as is.`;
		}
	}
	// throw new Error(`Macro not found: ${descriptor}`);
	return (
		<div
			style={{
				border: "1px dotted orange",
				color: "orange",
			}}
		>
			{msg} Can't render {descriptor}{" "}
			with config {JSON.stringify(config, null, 4)}
		</div>
	);
}
