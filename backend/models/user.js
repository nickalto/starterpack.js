var sequelize 	= module.parent.exports.sequelize,
Sequelize 		= require('sequelize');

/* Sequelize model definition for user
 * All options, types and validations can be found
 * on their website
 */
module.exports = model = sequelize.define('User', {
	first_name: Sequelize.STRING, 
	last_name: Sequelize.STRING,
	gender: Sequelize.STRING,
	location: Sequelize.STRING,
	picture: Sequelize.STRING,
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
	},
	//Authentications
	google_uid: Sequelize.STRING,
	google_accesstoken: Sequelize.STRING,
	google_refreshtoken: Sequelize.STRING,

	facebook_uid: Sequelize.STRING,
	facebook_accesstoken: Sequelize.STRING,
	facebook_refreshtoken: Sequelize.STRING,

	twitter_uid: Sequelize.STRING,
	twitter_accesstoken: Sequelize.STRING,
	twitter_refreshtoken: Sequelize.STRING,

	github_uid: Sequelize.STRING,
	github_accesstoken: Sequelize.STRING,
	github_refreshtoken: Sequelize.STRING,
}, {
	underscored:true
});

model.sync();

