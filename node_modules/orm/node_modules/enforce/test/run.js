var Mocha    = require('mocha');
var fs       = require('fs');
var path     = require('path');
var location = path.normalize(path.join(__dirname, "integration"));
var mocha    = new Mocha({
	reporter: "spec"
});

runTests();

function runTests() {
	fs.readdirSync(location).filter(function (file) {
		return file.substr(-3) === '.js';
	}).forEach(function (file) {
		mocha.addFile(
			path.join(location, file)
		);
	});
	mocha.run(function (failures) {
		process.exit(failures);
	});
}
