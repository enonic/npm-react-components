import type { MacroComponentParams } from '../types';

import { Message } from '../Common/Message';

export function BaseMacro({
	children,
	componentRegistry,
	config,
	descriptor,
	mode,
}: MacroComponentParams) {
	let msg = 'No Macro component provided to RichText.';

	if (componentRegistry) {
		const macroName = descriptor.includes(':') ? descriptor.split(':')[1] : descriptor;

		const MacroComponentDefinition = componentRegistry.getMacro<{
			children?: string | React.JSX.Element | React.JSX.Element[]
		}>(macroName);

		if (MacroComponentDefinition) {
			const MacroComponent = MacroComponentDefinition.View;
			return (
				<MacroComponent {...config}>{children}</MacroComponent>
			);
		} else {
			msg = `Component Registry doesn't have a macro named: ${macroName}!`;
		}
	}

	return (
		<Message
			mode={mode}
		>
			{msg} Can't render {descriptor}{" "}
			with config {JSON.stringify(config, null, 4)}
		</Message>
	);
}
