module.exports = function(){
	var sequelize = module.parent.exports.sequelize,
	AuthenticationProvider = {},
	Sequelize = require('sequelize');

	AuthenticationProvider.model = sequelize.define('AuthenticationProvider', {
		provider: Sequelize.STRING,
	}, {
		underscored:true
	});

	AuthenticationProvider.model.sync();

	return AuthenticationProvider;
}();
