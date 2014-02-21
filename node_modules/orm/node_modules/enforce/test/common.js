var should  = require("should");

exports.checkValidation = function (done, validation_err) {
	return function (err) {
		should.equal(err, validation_err);

		return done();
	};
};
