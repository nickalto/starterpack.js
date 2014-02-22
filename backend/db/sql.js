module.exports = function(){
	var mysql = require('mysql'),
	Sequelize = require('sequelize'),
	sql = {
		'name':'incubator',
		'user': 'root',
		'host': '127.0.0.1',
		'password': 'password',
	};

	sql.db = mysql.createConnection({
		host     : sql.host,
		user     : sql.user,
		password : sql.password,
	});

	sql.db.query('create database if not exists ' + sql.name);  

	var sequelize = exports.sequelize = new Sequelize(sql.name, sql.user, sql.password, {
      dialect: "mysql", 
      port:    3306, 
    });
 
	sequelize.authenticate().complete(function(err) {
	    if (!!err) {
	      console.log('Unable to connect to the database:', err)

	    } else {
	      console.log('Connection has been established successfully.')
	    }
	});

	exports.User = require('../models/user');
	exports.AuthenticationProvider = require('../models/authentication_provider');
	exports.Authentication = require('../models/Authentication');

	this.delete = function() {
		sql.db.query('DROP DATABASE ' + sql.name);
	};

	return sql;
}();
