module.exports = function(){
	var User 		= {},
	sequelize 	= module.parent.exports.sequelize,
	Sequelize 	= require('sequelize');

	User.model = sequelize.define('User', {
		first_name: Sequelize.STRING, 
		last_name: Sequelize.STRING,
		password: {
			type:Sequelize.STRING, 
			allowNull: false
		},
		username: {
			type:Sequelize.STRING, 
			allowNull: false
		},
		email_address: {
			type: Sequelize.STRING,
			validate: {
				isEmail:{
                    msg: "Email address is invalid"
				},
			}
		}
	}, {
		underscored:true
	});

	User.model.sync();

	return User;
}();
