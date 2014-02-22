module.exports = function(){
	var sequelize = module.parent.exports.sequelize,
	User = {},
	Sequelize = require('sequelize');

	User.model = sequelize.define('User', {
		first_name: Sequelize.STRING, 
		last_name: Sequelize.STRING,
		username: {
			type:Sequelize.STRING, 
			allowNull: false
		},
		username: {
			type:Sequelize.STRING, 
			allowNull: false
		},
		email_address: Sequelize.STRING,
	}, {
		underscored:true
	});

	User.model.sync();

	return User;
}();
