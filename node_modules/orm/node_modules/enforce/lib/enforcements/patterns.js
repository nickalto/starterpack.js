/**
 * Check if a value matches a given pattern.
 * You can define a pattern string and regex
 * modifiers or just send the RegExp object
 * as 1st argument.
 **/
exports.match = function (pattern, modifiers, msg) {
	if (typeof pattern == "string") {
		pattern = new RegExp(pattern, modifiers);
	}
	return function (v, next) {
		if (typeof v == "string" && v.match(pattern)) return next();
		return next(msg || 'no-pattern-match');
	};
};

/**
 * Check if a value is an hexadecimal string
 * (letters from A to F and numbers).
 **/
exports.hexString = function (msg) {
	return exports.match("^[a-f0-9]+$", "i", msg || "not-hex-string");
};

/**
 * Check if a value is an e-mail address
 * (simple checking, works 99%).
 **/
exports.email = function (msg) {
	return exports.match("^[a-z0-9\\._%\\+\\-]+@[a-z0-9\\.\\-]+\\.[a-z]{2,6}$", "i", msg || "not-valid-email");
};

/**
 * Check if it's a valid IPv4 address.
 **/
exports.ipv4 = function (msg) {
	var p1 = "([1-9]|1[0-9][0-9]?|2[0-4][0-9]|25[0-4])";
	var p2 = "([0-9]|1[0-9][0-9]?|2[0-4][0-9]|25[0-4])";
	return exports.match("^" + [ p1, p2, p2, p1 ].join("\\.") + "$", "", msg || "not-valid-ipv4");
};
