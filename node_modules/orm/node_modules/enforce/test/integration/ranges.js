var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce.ranges", function () {
	it("should have .number()", function (done) {
		enforce.ranges.number.should.be.a("function");

		return done();
	});
	it("should have .length()", function (done) {
		enforce.ranges.length.should.be.a("function");

		return done();
	});
});

describe("enforce.ranges.number(0, 10)", function () {
	var validator = enforce.ranges.number(0, 10);

	it("should pass 5", function (done) {
		validator(5, common.checkValidation(done));
	});

	it("should not pass -5", function (done) {
		validator(-5, common.checkValidation(done, 'out-of-range-number'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.number(0, 10, 'custom-error');

		it("should not pass -5 with 'custom-error'", function (done) {
			validator(-5, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.number(undefined, 10)", function () {
	var validator = enforce.ranges.number(undefined, 10);

	it("should pass 0", function (done) {
		validator(0, common.checkValidation(done));
	});

	it("should pass 5", function (done) {
		validator(5, common.checkValidation(done));
	});

	it("should pass -5", function (done) {
		validator(-5, common.checkValidation(done));
	});

	it("should not pass null", function (done) {
		validator(null, common.checkValidation(done, 'undefined'));
	});

	it("should not pass 15", function (done) {
		validator(15, common.checkValidation(done, 'out-of-range-number'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.number(undefined, 10, 'custom-error');

		it("should not pass 15 with 'custom-error'", function (done) {
			validator(15, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.number(-10, undefined)", function () {
	var validator = enforce.ranges.number(-10, undefined);

	it("should pass 0", function (done) {
		validator(0, common.checkValidation(done));
	});

	it("should pass -5", function (done) {
		validator(-5, common.checkValidation(done));
	});

	it("should pass 5", function (done) {
		validator(5, common.checkValidation(done));
	});

	it("should not pass null", function (done) {
		validator(null, common.checkValidation(done, 'undefined'));
	});

	it("should not pass -15", function (done) {
		validator(-15, common.checkValidation(done, 'out-of-range-number'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.number(-10, undefined, 'custom-error');

		it("should not pass -15 with 'custom-error'", function (done) {
			validator(-15, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.number(0, undefined)", function () {
	var validator = enforce.ranges.number(0, undefined);

	it("should pass 0", function (done) {
		validator(0, common.checkValidation(done));
	});

	it("should pass 5", function (done) {
		validator(5, common.checkValidation(done));
	});

	it("should not pass null", function (done) {
		validator(null, common.checkValidation(done, 'undefined'));
	});

	it("should not pass -5", function (done) {
		validator(-5, common.checkValidation(done, 'out-of-range-number'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.number(0, undefined, 'custom-error');

		it("should not pass -15 with 'custom-error'", function (done) {
			validator(-15, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.length(0, 10)", function () {
	var validator = enforce.ranges.length(0, 10);

	it("should pass 'test'", function (done) {
		validator('test', common.checkValidation(done));
	});

	it("should not pass 'hello world'", function (done) {
		validator('hello world', common.checkValidation(done, 'out-of-range-length'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.length(0, 10, 'custom-error');

		it("should not pass 'hello world' with 'custom-error'", function (done) {
			validator('hello world', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.length(undefined, 10)", function () {
	var validator = enforce.ranges.length(undefined, 10);

	it("should pass 'test'", function (done) {
		validator('test', common.checkValidation(done));
	});

	it("should not pass 'hello world'", function (done) {
		validator('hello world', common.checkValidation(done, 'out-of-range-length'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.length(undefined, 10, 'custom-error');

		it("should not pass 'hello world' with 'custom-error'", function (done) {
			validator('hello world', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.ranges.length(0, undefined)", function () {
	var validator = enforce.ranges.length(0, undefined);

	it("should pass 'test'", function (done) {
		validator('test', common.checkValidation(done));
	});

	it("should pass 'hello world'", function (done) {
		validator('hello world', common.checkValidation(done));
	});
});

describe("enforce.ranges.length(5, undefined)", function () {
	var validator = enforce.ranges.length(5, undefined);

	it("should pass 'hello world'", function (done) {
		validator('hello world', common.checkValidation(done));
	});

	it("should not pass 'test'", function (done) {
		validator('test', common.checkValidation(done, 'out-of-range-length'));
	});

	describe("width custom error", function () {
		var validator = enforce.ranges.length(5, undefined, 'custom-error');

		it("should not pass 'test' with 'custom-error'", function (done) {
			validator('test', common.checkValidation(done, 'custom-error'));
		});
	});
});
