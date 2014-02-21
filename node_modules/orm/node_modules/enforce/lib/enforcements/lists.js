/**
 * Check if a value (number or string) is
 * in a list of values.
 **/
exports.inside = function (list, msg) {
	return function (v, next) {
		if (list.indexOf(v) >= 0) return next();
		return next(msg || 'outside-list');
	};
};

/**
 * Check if a value (number or string) is
 * not in a list of values.
 **/
exports.outside = function (list, msg) {
	return function (v, next) {
		if (list.indexOf(v) == -1) return next();
		return next(msg || 'inside-list');
	};
};
