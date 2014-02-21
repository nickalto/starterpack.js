var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce.lists", function () {
	it("should have .inside()", function (done) {
		enforce.lists.inside.should.be.a("function");

		return done();
	});
	it("should have .outside()", function (done) {
		enforce.lists.outside.should.be.a("function");

		return done();
	});
});

describe("enforce.lists.inside([ 1, 2, 3 ])", function () {
	var validator = enforce.lists.inside([ 1, 2, 3 ]);

	it("should pass 1", function (done) {
		validator(1, common.checkValidation(done));
	});

	it("should pass 3", function (done) {
		validator(3, common.checkValidation(done));
	});

	it("should not pass -1", function (done) {
		validator(-1, common.checkValidation(done, 'outside-list'));
	});

	it("should not pass '1'", function (done) {
		validator('1', common.checkValidation(done, 'outside-list'));
	});

	it("should not pass []", function (done) {
		validator([], common.checkValidation(done, 'outside-list'));
	});

	describe("width custom error", function () {
		var validator = enforce.lists.inside([ 1, 2, 3 ], 'custom-error');

		it("should not pass -1 with 'custom-error'", function (done) {
			validator(-1, common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.lists.outside([ 1, 2, 3 ])", function () {
	var validator = enforce.lists.outside([ 1, 2, 3 ]);

	it("should pass 4", function (done) {
		validator(4, common.checkValidation(done));
	});

	it("should pass -2", function (done) {
		validator(-2, common.checkValidation(done));
	});

	it("should pass ''", function (done) {
		validator('', common.checkValidation(done));
	});

	it("should pass null", function (done) {
		validator(null, common.checkValidation(done));
	});

	it("should not pass 2", function (done) {
		validator(2, common.checkValidation(done, 'inside-list'));
	});

	describe("width custom error", function () {
		var validator = enforce.lists.outside([ 1, 2, 3 ], 'custom-error');

		it("should not pass 2 with 'custom-error'", function (done) {
			validator(2, common.checkValidation(done, 'custom-error'));
		});
	});
});
