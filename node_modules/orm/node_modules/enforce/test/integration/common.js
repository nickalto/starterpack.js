var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce", function () {
	it("should have .required()", function (done) {
		enforce.required.should.be.a("function");

		return done();
	});
	it("should have .notEmptyString()", function (done) {
		enforce.notEmptyString.should.be.a("function");

		return done();
	});
});

describe("enforce.required()", function () {
	var validator = enforce.required();

	it("should pass 1", function (done) {
		validator(1, common.checkValidation(done));
	});

	it("should pass 0", function (done) {
		validator(0, common.checkValidation(done));
	});

	it("should pass ''", function (done) {
		validator('', common.checkValidation(done));
	});

	it("should pass false", function (done) {
		validator(false, common.checkValidation(done));
	});

	it("should not pass null", function (done) {
		validator(null, common.checkValidation(done, 'required'));
	});

	it("should not pass undefined", function (done) {
		validator(undefined, common.checkValidation(done, 'required'));
	});

	describe("width custom error", function () {
		var validator = enforce.required('custom-error');

		it("should not pass null with 'custom-error'", function (done) {
			validator(null, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.notEmptyString()", function () {
	var validator = enforce.notEmptyString();

	it("should pass 'hello'", function (done) {
		validator('hello', common.checkValidation(done));
	});

	it("should pass ' '", function (done) {
		validator(' ', common.checkValidation(done));
	});

	it("should not pass ''", function (done) {
		validator('', common.checkValidation(done, 'empty-string'));
	});

	describe("width custom error", function () {
		var validator = enforce.notEmptyString('custom-error');

		it("should not pass '' with 'custom-error'", function (done) {
			validator('', common.checkValidation(done, 'custom-error'));
		});
	});
});
