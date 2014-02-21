var patterns            = require("./patterns");
var creditcard_prefixes = {
	amex       : [ "34", "37" ],
	maestro    : [ "5018", "5020", "5038", "5893", "6304", "6759", "6761", "6762", "6763" ],
	mastercard : [ "51", "52", "53", "54", "55" ],
	discover4  : [ "6011" ],
	discover3  : [ "644", "645", "646", "647", "648", "649" ],
	discover2  : [ "65" ]
};

exports.username = function () {
	var opts = {
		length : 2,
		expr   : null
	};
	var msg  = "invalid-username";

	for (var i = 0; i < arguments.length; i++) {
		switch (typeof arguments[i]) {
			case "string":
				msg = arguments[i];
				break;
			case "object":
				for (var k in arguments[i]) {
					opts[k] = arguments[i][k];
				}
				break;
		}
	}

	if (opts.expr === null) {
		opts.expr = new RegExp("^[a-z_][a-z0-9_\\-]{" + (opts.length - 1) + ",}$", "i");
	}

	return patterns.match(opts.expr, "", msg);
};

exports.password = function (checks, msg) {
	if (!msg) {
		msg    = checks;
		checks = "luns6"; // (l)owercase, (u)ppercase, (n)umber, (s)pecial characters, (6) min length
	}
	if (!msg) {
		msg    = "weak-password";
	}
	var m = checks.match(/([0-9]+)/);
	var min_len = (m ? parseInt(m[1], 10) : null);

	return function (v, next) {
		if (!v) return next(msg);

		if (checks.indexOf("l") >= 0 && !v.match(/[a-z]/)) return next(msg);
		if (checks.indexOf("u") >= 0 && !v.match(/[A-Z]/)) return next(msg);
		if (checks.indexOf("n") >= 0 && !v.match(/[0-9]/)) return next(msg);
		if (checks.indexOf("s") >= 0 && !v.match(/[^a-zA-Z0-9]/)) return next(msg);
		if (min_len !== null && min_len > v.length) return next(msg);

		return next();
	};
};

exports.creditcard = function () {
	var types = [ "amex", "visa", "maestro", "discover", "mastercard" ];
	var msg   = "not-valid-creditcard";

	for (var i = 0; i < arguments.length; i++) {
		if (Array.isArray(arguments[i])) {
			types = arguments[i];
		} else if (typeof arguments[i] == "string") {
			msg = arguments[i];
		}
	}

	return function (v, next) {
		if (!v) return next(msg);

		v = "" + v;

		var ok = false;

		// check right now for the possible types
		for (var i = 0; i < types.length; i++) {
			switch (types[i]) {
				case "amex":
					if (v.length != 15) break;

					ok = (creditcard_prefixes.amex.indexOf(v.substr(0, 2)) >= 0);
					break;
				case "visa":
					if (v.length < 13) break;
					if (v.length > 16) break;

					ok = (v[0] == "4");
					break;
				case "maestro":
					if (v.length < 16) break;
					if (v.length > 19) break;

					ok = (creditcard_prefixes.maestro.indexOf(v.substr(0, 4)) >= 0);
					break;
				case "mastercard":
					if (v.length < 16) break;
					if (v.length > 19) break;

					ok = (creditcard_prefixes.mastercard.indexOf(v.substr(0, 2)) >= 0);
					break;
				case "discover":
					if (v.length != 16) break;

					ok = (creditcard_prefixes.discover4.indexOf(v.substr(0, 4)) >= 0) ||
					     (creditcard_prefixes.discover3.indexOf(v.substr(0, 3)) >= 0) ||
					     (creditcard_prefixes.discover2.indexOf(v.substr(0, 2)) >= 0);

					if (!ok) {
						var prefix = +v.substr(0, 6);

						ok = (!isNaN(prefix) && prefix >= 622126 && prefix <= 622925);
					}
					break;
				case "luhn":
					// fallback
					ok = true;
					break;
			}
			if (ok) break;
		}

		if (!ok) {
			return next(msg);
		}

		// it's in one of possible types, let's check Luhn
		var check  = +v[v.length - 1];

		if (isNaN(check)) {
			return next(msg);
		}

		var digits = v.slice(0, v.length - 1).split('');
		digits.reverse();

		for (var i = 0; i < digits.length; i++) {
			digits[i] = +digits[i];
			if (isNaN(digits[i])) {
				return next(msg);
			}

			if (i % 2 === 0) {
				digits[i] *= 2;
				if (digits[i] > 9) {
					digits[i] -= 9;
				}
			}
		}

		check += digits.reduce(function (a, b) { return a + b; });

		return next(check % 10 !== 0 ? msg : null);
	};
};
