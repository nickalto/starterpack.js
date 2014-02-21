var common = require("./lib/enforcements/common");

exports.security = require("./lib/enforcements/security");
exports.patterns = require("./lib/enforcements/patterns");
exports.ranges   = require("./lib/enforcements/ranges");
exports.lists    = require("./lib/enforcements/lists");

for (var k in common) {
	exports[k] = common[k];
}

exports.Enforce = require("./lib/Enforce").Enforce;
