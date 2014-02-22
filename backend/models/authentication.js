module.exports = function(){
	var sequelize 			= module.parent.exports.sequelize,
	User 					= require('./user'),
	AuthenticationProvider	= require('./authentication_provider'),
	Sequelize 				= require('sequelize'),
	Authentication 			= {};

	Authentication.model = sequelize.define('Authentication', {
		first_name: Sequelize.STRING,
		last_name: Sequelize.STRING,
		display_name: Sequelize.STRING,
		token: Sequelize.STRING,
		gender: Sequelize.STRING,
		location: Sequelize.STRING,
		picture: Sequelize.STRING,
	},  {
		underscored:true
	});

	User.model.hasOne(Authentication.model);
	AuthenticationProvider.model.hasMany(Authentication.model);
	Authentication.model.sync();

	return Authentication;
}();
