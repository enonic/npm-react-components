import type { MacroComponentParams } from '../types';

import { Message } from '../Common/Message';

export function Macro({
	config,
	descriptor,
	mode,
}: MacroComponentParams) {
	const msg = 'No Macro component provided to RichText.';
	return (
		<Message
			mode={mode}
		>
			{msg} Can't render {descriptor}{" "}
			with config {JSON.stringify(config, null, 4)}
		</Message>
	);
}
