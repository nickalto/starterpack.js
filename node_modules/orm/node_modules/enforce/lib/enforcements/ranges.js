/**
 * Check if a number is between a minimum and
 * a maximum number. One of this constraints
 * can be omitted.
 **/
exports.number = function (min, max, msg) {
	return function (n, next) {
		if (n === undefined || n === null) return next('undefined');
		if (min === undefined && n <= max) return next();
		if (max === undefined && n >= min) return next();
		if (n >= min && n <= max) return next();
		return next(msg || 'out-of-range-number');
	};
};

/**
 * Check if a string length is between a minimum
 * and a maximum number. One of this constraints
 * can be omitted.
 **/
exports.length = function (min, max, msg) {
	return function (v, next) {
		if (v === undefined || v === null) return next('undefined');
		if (min === undefined && v.length <= max) return next();
		if (max === undefined && v.length >= min) return next();
		if (v.length >= min && v.length <= max) return next();
		return next(msg || 'out-of-range-length');
	};
};
