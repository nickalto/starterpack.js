var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce.Enforce", function () {
	it("should be a function", function (done) {
		enforce.Enforce.should.be.a("function");

		return done();
	});
	it("should create an object with .add() and .check()", function (done) {
		var checks = new enforce.Enforce();

		checks.add.should.be.a("function");
		checks.check.should.be.a("function");

		return done();
	});
	it("should accept options as first argument", function (done) {
		var checks = new enforce.Enforce({
			returnAllErrors : false
		});

		checks.options.returnAllErrors.should.equal(false);

		checks = new enforce.Enforce({
			returnAllErrors : true
		});

		checks.options.returnAllErrors.should.equal(true);

		return done();
	});
});

describe("new enforce.Enforce()", function () {
	describe(".add", function () {
		var checks = new enforce.Enforce();

		it("should throw if not passing a validator", function (done) {
			(function () {
				checks.add("prop");
			}).should.throwError();

			(function () {
				checks.add("prop", "validator");
			}).should.throwError();

			(function () {
				checks.add("prop", function () {});
			}).should.not.throwError();

			return done();
		});
	});

	describe(".clear", function () {
		var checks = new enforce.Enforce();
		checks.add("prop", function () {});

		it("should clear all validators", function (done) {
			Object.keys(checks.validations).length.should.be.above(0);

			checks.clear();

			Object.keys(checks.validations).length.should.equal(0);

			return done();
		});
	});

	describe(".check (default options)", function () {
		it("should return no error if it's ok", function (done) {
			var checks = new enforce.Enforce();

			checks.add("prop", enforce.lists.inside([ 1, 2, 3 ]));
			checks.add("prop", enforce.lists.inside([ 3, 4, 5 ]));

			checks.check({
				prop : 3
			}, function (err) {
				should.not.exist(err);

				return done();
			});
		});

		it("should return after first error", function (done) {
			var checks = new enforce.Enforce();

			checks.add("prop", enforce.lists.inside([ 1, 2, 3 ], "first-error"));
			checks.add("prop", enforce.lists.inside([ 3, 4, 5 ], "last-error"));

			checks.check({
				prop : 6
			}, function (err) {
				should.exist(err);

				err.msg.should.equal("first-error");

				return done();
			});
		});
	});

	describe(".check (returnAllErrors = true)", function () {
		it("should return no error if it's ok", function (done) {
			var checks = new enforce.Enforce({
				returnAllErrors : true
			});

			checks.add("prop", enforce.lists.inside([ 1, 2, 3 ]));
			checks.add("prop", enforce.lists.inside([ 3, 4, 5 ]));

			checks.check({
				prop : 3
			}, function (err) {
				should.not.exist(err);

				return done();
			});
		});

		it("should return after all validations", function (done) {
			var checks = new enforce.Enforce({
				returnAllErrors : true
			});

			checks.add("prop", enforce.lists.inside([ 1, 2, 3 ], "first-error"));
			checks.add("prop", enforce.lists.inside([ 3, 4, 5 ], "last-error"));

			checks.check({
				prop : 6
			}, function (err) {
				should.exist(err);
				should(Array.isArray(err));

				err[0].msg.should.equal("first-error");
				err[1].msg.should.equal("last-error");

				return done();
			});
		});
	});
});
