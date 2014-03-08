module.exports = function(){
	var mysql = require('mysql'),
	Sequelize = require('sequelize'),

	/* Update database credentials here
	 * based on your own system's configuration
	 */
	sql = {
		'name':'starterpack',
		'user': 'root',
		'host': '127.0.0.1',
		'password': 'password',
	};

	sql.db = mysql.createConnection({
		host     : sql.host,
		user     : sql.user,
		password : sql.password,
	});

	// create database if doesn't exist and continue 
	sql.db.query('create database if not exists ' + sql.name);  

	var sequelize = exports.sequelize = new Sequelize(sql.name, sql.user, sql.password, {
      dialect: "mysql", 
      port:    3306, 
    });
 
	sequelize.authenticate().complete( function(err) {
		if (err) {
			new Error('backend/db/sql.js: unable to connect to the database:', err);
		} 
	});

	// include models here
	sql.User = require('../models/user');

	return sql;
}();
