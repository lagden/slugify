'use strict';
const deburr = require('lodash.deburr');
const escapeStringRegexp = require('escape-string-regexp');

const decamelize = string => {
	return string
		.replace(/([a-z\d])([A-Z])/g, `$1 $2`)
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1 $2`);
};

const builtinReplacements = new Map([
	['&', 'and'],
	['🦄', 'unicorn'],
	['♥', 'love']
]);

const doCustomReplacements = (string, replacements) => {
	for (const [key, value] of replacements) {
		string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), ` ${value} `);
	}

	return string;
};

const removeMootSeparators = (string, separator) => {
	return string
		.replace(new RegExp(`${separator}{2,}`, 'g'), separator)
		.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
};

module.exports = (string, options) => {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = Object.assign({
		separator: '-',
		customReplacements: [],
		lowerCase: true
	}, options);

	const separator = escapeStringRegexp(options.separator);
	const {lowerCase} = options;
	const customReplacements = new Map([
		...builtinReplacements,
		...options.customReplacements
	]);

	let regex = /[^a-zA-Z\d]+/g;

	string = deburr(string);
	string = decamelize(string);
	string = doCustomReplacements(string, customReplacements);
	if (lowerCase) {
		string = string.toLowerCase();
		regex = /[^a-z\d]+/g;
	}
	string = string.replace(regex, separator);
	string = string.replace(/\\/g, '');
	string = removeMootSeparators(string, separator);

	return string;
};
