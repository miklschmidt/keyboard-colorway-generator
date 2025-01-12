const modifierKeys = [
	'shift',
	'ctrl',
	'alt',
	'meta',
	'cmd',
	'command',
	'option',
	'opt',
	'tab',
	'enter',
	'esc',
	'capslock',
	'caps lock',
	'f1',
	'f2',
	'f3',
	'f4',
	'f5',
	'f6',
	'f7',
	'f8',
	'f9',
	'f10',
	'f11',
	'f12',
	'printscreen',
	'print screen',
	'print scr',
	'scrolllock',
	'scroll lock',
	'pause',
	'break',
	'home',
	'end',
	'pageup',
	'pgup',
	'pagedown',
	'pgdn',
	'insert',
	'delete',
	'backspace',
	'|',
	'\\',
	'~',
	'`',
	'fn',
	'win',
	'menu',
];

export const isModifierKey = (labels: string[]) => {
	return labels.filter((label) => label != null).some((label) => modifierKeys.includes(label.toLowerCase()));
};

export const isAlphaKey = (labels: string[]) => {
	// Matches basic alphanumeric, Nordic characters (åäöæøå), other common Latin characters with diacritics as well as some special characters found on numeric keys.
	// Not perfect (some special characters are not matched, and may match where they shouldn't on some layouts), but should cover most cases.
	return labels
		.filter((label) => label != null)
		.some(
			(label) =>
				label.match(
					/^[a-zA-Z0-9åäöæøåÅÄÖÆØÅéèêëÉÈÊËíìîïÍÌÎÏóòôõöÓÒÔÕÖúùûüÚÙÛÜýÿÝñÑ\[\]\-\+\=\(\)\[\]\{\}\;\:\'\"\.\,\<\>\/\?\!\^\#\$\%\&\*\_]$/,
				) != null,
		);
};

export const isSpecialKey = (labels: string[]) => {
	return labels.every(
		(label) => label.startsWith('f') || label.startsWith('esc') || label.startsWith('tab') || label.startsWith('enter'),
	);
};

export const isSpaceKey = (labels: string[]) => {
	return labels
		.filter((label) => label != null)
		.every((label) => label.startsWith('space') || label.startsWith('spacebar') || label == '' || label == null);
};

const kleKeyToBrowserKeyMap = {
	ctrl: 'control',
	shift: 'shift',
	alt: 'alt',
	meta: 'meta',
	cmd: 'meta',
	option: 'alt',
	tab: 'tab',
	enter: 'enter',
	esc: 'escape',
	backspace: 'backspace',
	'': 'space',
	backtick: 'backtick',
	backslash: 'backslash',
	comma: 'comma',
	period: 'period',
	slash: 'slash',
	pgdn: 'page down',
	pgup: 'page up',
	home: 'home',
	end: 'end',
	insert: 'insert',
	delete: 'delete',
	scrolllock: 'scroll lock',
};

export const kleKeyToBrowserKey = (key: string) => {
	return kleKeyToBrowserKeyMap[key.toLocaleLowerCase() as keyof typeof kleKeyToBrowserKeyMap] || key;
};
