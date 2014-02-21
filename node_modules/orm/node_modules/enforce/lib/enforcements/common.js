var ranges = require("./ranges");

/**
 * Make sure the property isn't `NULL` or `undefined`.
 * Note: 0 and '' will be considered valid.
 **/
exports.required = function (msg) {
	return function (v, next) {
		if(v === null || v === undefined) return next(msg || 'required')
		else return next();
	};
};

/**
 * Check if a string has zero length. Sometimes
 * you might want to have a property on your
 * model that is not required but on a specific
 * form it can be.
 **/
exports.notEmptyString = function (msg) {
	return ranges.length(1, undefined, msg || "empty-string");
};
