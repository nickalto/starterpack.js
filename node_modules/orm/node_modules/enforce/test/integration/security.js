var should  = require("should");
var common  = require("../common");
var enforce = require("../..");

describe("enforce.security", function () {
	it("should have .password()", function (done) {
		enforce.security.password.should.be.a("function");

		return done();
	});
});

describe("enforce.security.password()", function () {
	var validator = enforce.security.password();

	it("should pass 'Passw0r∂'", function (done) {
		validator('Passw0r∂', common.checkValidation(done));
	});

	it("should not pass 'password'", function (done) {
		validator('password', common.checkValidation(done, 'weak-password'));
	});

	describe("width custom error", function () {
		var validator = enforce.security.password('custom-error');

		it("should not pass 'password' with 'custom-error'", function (done) {
			validator('password', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.security.username()", function () {
	var validator = enforce.security.username();

	it("should pass 'a1'", function (done) {
		validator('a1', common.checkValidation(done));
	});

	it("should pass 'A1'", function (done) {
		validator('A1', common.checkValidation(done));
	});

	it("should pass '_A1'", function (done) {
		validator('_A1', common.checkValidation(done));
	});

	it("should not pass 'a'", function (done) {
		validator('a', common.checkValidation(done, 'invalid-username'));
	});

	describe("width custom error", function () {
		var validator = enforce.security.username('custom-error');

		it("should not pass 'a' with 'custom-error'", function (done) {
			validator('a', common.checkValidation(done, 'custom-error'));
		});
	});
});

describe("enforce.security.username({ length: 5 })", function () {
	var validator = enforce.security.username({ length: 5 });

	it("should not pass 'a1'", function (done) {
		validator('a1', common.checkValidation(done, 'invalid-username'));
	});

	it("should not pass 'abcd'", function (done) {
		validator('abcd', common.checkValidation(done, 'invalid-username'));
	});

	it("should pass 'username'", function (done) {
		validator('username', common.checkValidation(done));
	});
});

describe("enforce.security.password('ln4')", function () {
	var validator = enforce.security.password('ln4', 'weak');

	it("should pass 'Passw0r∂'", function (done) {
		validator('Passw0r∂', common.checkValidation(done));
	});

	it("should pass 'Passw0rd'", function (done) {
		validator('Passw0rd', common.checkValidation(done));
	});

	it("should not pass 'P12345'", function (done) {
		validator('P12345', common.checkValidation(done, 'weak'));
	});

	it("should not pass 'password'", function (done) {
		validator('password', common.checkValidation(done, 'weak'));
	});

	it("should not pass 'p12'", function (done) {
		validator('p12', common.checkValidation(done, 'weak'));
	});
});

describe("enforce.security.creditcard()", function () {
	var validator = enforce.security.creditcard();

	it("should pass '4716025001543325' (VISA)", function (done) {
		validator('4716025001543325', common.checkValidation(done));
	});

	it("should pass '6011484016942229' (Discover)", function (done) {
		validator('6011484016942229', common.checkValidation(done));
	});

	it("should pass '5194162135294737' (Mastercard)", function (done) {
		validator('5194162135294737', common.checkValidation(done));
	});

	it("should pass '6304709865953729' (Maestro)", function (done) {
		validator('6304709865953729', common.checkValidation(done));
	});

	it("should pass '342106257219198' (American Express)", function (done) {
		validator('342106257219198', common.checkValidation(done));
	});

	it("should not pass '342106257219199'", function (done) {
		validator('342106257219199', common.checkValidation(done, 'not-valid-creditcard'));
	});

	it("should not pass '5194162135294734'", function (done) {
		validator('5194162135294734', common.checkValidation(done, 'not-valid-creditcard'));
	});

	it("should not pass '6011484019642229'", function (done) {
		validator('6011484019642229', common.checkValidation(done, 'not-valid-creditcard'));
	});

	it("should not pass '4917972403611992'", function (done) {
		validator('4917972403611992', common.checkValidation(done, 'not-valid-creditcard'));
	});
});

describe("enforce.security.creditcard([ 'amex' ], 'not-valid')", function () {
	var validator = enforce.security.creditcard([ 'amex' ], 'not-valid');

	it("should pass '342106257219198' (American Express)", function (done) {
		validator('342106257219198', common.checkValidation(done));
	});

	it("should not pass '4716025001543325' (VISA) with 'not-valid'", function (done) {
		validator('4716025001543325', common.checkValidation(done, 'not-valid'));
	});
});

describe("enforce.security.creditcard([ 'visa' ], 'not-valid')", function () {
	var validator = enforce.security.creditcard([ 'visa' ], 'not-valid');

	it("should pass '4716025001543325' (VISA)", function (done) {
		validator('4716025001543325', common.checkValidation(done));
	});

	it("should not pass '342106257219198' (American Express) with 'not-valid'", function (done) {
		validator('342106257219198', common.checkValidation(done, 'not-valid'));
	});
});

describe("enforce.security.creditcard([ 'maestro', 'discover' ], 'not-valid')", function () {
	var validator = enforce.security.creditcard([ 'maestro', 'discover' ], 'not-valid');

	it("should pass '5038328991436353' (Maestro)", function (done) {
		validator('5038328991436353', common.checkValidation(done));
	});

	it("should pass '6011734449679115' (Discover)", function (done) {
		validator('6011734449679115', common.checkValidation(done));
	});

	it("should not pass '4485227446136769' (VISA) with 'not-valid'", function (done) {
		validator('4485227446136769', common.checkValidation(done, 'not-valid'));
	});
});

describe("enforce.security.creditcard([ 'luhn' ], 'not-valid')", function () {
	var validator = enforce.security.creditcard([ 'luhn' ], 'not-valid');

	it("should pass '12344' (Luhn)", function (done) {
		validator('12344', common.checkValidation(done));
	});

	it("should not pass '12345' with 'not-valid'", function (done) {
		validator('12345', common.checkValidation(done, 'not-valid'));
	});
});
