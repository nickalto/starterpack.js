var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce.patterns", function () {
	it("should have .match()", function (done) {
		enforce.patterns.match.should.be.a("function");

		return done();
	});
	it("should have .hexString()", function (done) {
		enforce.patterns.hexString.should.be.a("function");

		return done();
	});
	it("should have .email()", function (done) {
		enforce.patterns.email.should.be.a("function");

		return done();
	});
	it("should have .ipv4()", function (done) {
		enforce.patterns.ipv4.should.be.a("function");

		return done();
	});
});

describe("enforce.patterns.hexString()", function () {
	var validator = enforce.patterns.hexString();

	it("should pass 'ABCDEF0123456789'", function (done) {
		validator('ABCDEF0123456789', common.checkValidation(done));
	});

	it("should pass 'abcdef0123456789'", function (done) {
		validator('abcdef0123456789', common.checkValidation(done));
	});

	it("should not pass 'af830g'", function (done) {
		validator('af830g', common.checkValidation(done, 'not-hex-string'));
	});

	it("should not pass ''", function (done) {
		validator('', common.checkValidation(done, 'not-hex-string'));
	});

	describe("width custom error", function () {
		var validator = enforce.patterns.hexString('custom-error');

		it("should not pass 'af830g' with 'custom-error'", function (done) {
			validator('af830g', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.patterns.email()", function () {
	var validator = enforce.patterns.email();

	it("should pass 'niceandsimple@example.com'", function (done) {
		validator('niceandsimple@example.com', common.checkValidation(done));
	});

	it("should pass 'Very.Common@example.com'", function (done) {
		validator('Very.Common@example.com', common.checkValidation(done));
	});

	it("should pass 'disposable.style.email.with+symbol@example.com'", function (done) {
		validator('disposable.style.email.with+symbol@example.com', common.checkValidation(done));
	});

	it("should not pass 'Abc.example.com'", function (done) {
		validator('Abc.example.com', common.checkValidation(done, 'not-valid-email'));
	});

	it("should not pass 'A@b@c@example.com'", function (done) {
		validator('A@b@c@example.com', common.checkValidation(done, 'not-valid-email'));
	});

	it("should not pass 'not\\allowed@example.com'", function (done) {
		validator('not\\allowed@example.com', common.checkValidation(done, 'not-valid-email'));
	});

	it("should not pass 'abc@example'", function (done) {
		validator('abc@example', common.checkValidation(done, 'not-valid-email'));
	});

	describe("width custom error", function () {
		var validator = enforce.patterns.email('custom-error');

		it("should not pass 'abc@example' with 'custom-error'", function (done) {
			validator('abc@example', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.patterns.ipv4()", function () {
	var validator = enforce.patterns.ipv4();

	it("should pass '1.2.3.4'", function (done) {
		validator('1.2.3.4', common.checkValidation(done));
	});

	it("should pass '1.0.0.1'", function (done) {
		validator('1.0.0.1', common.checkValidation(done));
	});

	it("should pass '1.10.100.254'", function (done) {
		validator('1.10.100.254', common.checkValidation(done));
	});

	it("should not pass '1.10.100.255'", function (done) {
		validator('1.10.100.255', common.checkValidation(done, 'not-valid-ipv4'));
	});

	it("should not pass '1.10.100.0'", function (done) {
		validator('1.10.100.0', common.checkValidation(done, 'not-valid-ipv4'));
	});

	it("should not pass '0.1.2.3'", function (done) {
		validator('0.1.2.3', common.checkValidation(done, 'not-valid-ipv4'));
	});

	describe("width custom error", function () {
		var validator = enforce.patterns.ipv4('custom-error');

		it("should not pass '0.1.2.3' with 'custom-error'", function (done) {
			validator('0.1.2.3', common.checkValidation(done, 'custom-error'));
		});
	});
});
