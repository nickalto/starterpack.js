/*jshint -W062 */
module.exports = function(){
	var mysql = require("mysql"),
	orm = require("orm"),
	db = {};

	db.name = 'incubator';
	db.user = 'root';
	db.host = '127.0.0.1';
	db.password = 'password';

	this.connect = function() {
		return db.mysql = mysql.createConnection({
			host     : db.host,
			user     : db.user,
			password : db.password,
		});
	};

	this.initialize_db = function() {
		db.mysql.query('CREATE DATABASE IF NOT EXISTS ' + db.name);  
		db.mysql.query('USE ' + db.name);
		db.mysql.query(
			'CREATE TABLE IF NOT EXISTS Users ( ' +
				'id MEDIUMINT NOT NULL AUTO_INCREMENT, ' + 
				'first_name VARCHAR(256) NOT NULL, ' +
				'last_name VARCHAR(256) NOT NULL, ' +
				'username VARCHAR(256) NOT NULL, ' +
				'password VARCHAR(256) NOT NULL, ' +
				'email_address VARCHAR(256) NOT NULL, ' +
				'date_created DATETIME NOT NULL, ' +
				'date_active DATETIME NOT NULL, ' +
				'PRIMARY KEY (id)' + 
			');'
		);
		db.mysql.query(
			'CREATE TABLE IF NOT EXISTS AuthenticationProvider ( ' +
				'id MEDIUMINT NOT NULL AUTO_INCREMENT, ' + 
				'provider VARCHAR(256) NOT NULL, ' + 
				'PRIMARY KEY (id)' + 
			');'
		);
		db.mysql.query(
			'CREATE TABLE IF NOT EXISTS Authentication ( ' +
				'id MEDIUMINT NOT NULL AUTO_INCREMENT, ' + 
				'user_id MEDIUMINT NOT NULL,' + 
				'provider_id MEDIUMINT NOT NULL,' + 
				'first_name VARCHAR(256) NOT NULL, ' +
				'last_name VARCHAR(256) NOT NULL, ' +
				'display_name VARCHAR(256) NOT NULL, ' +
				'token VARCHAR(512) NOT NULL, ' +
				'gender VARCHAR(256) NOT NULL, ' +
				'location VARCHAR(256) NOT NULL, ' +
				'picture VARCHAR(256) NOT NULL, ' +
				'PRIMARY KEY (id),' + 
				'FOREIGN KEY (user_id) REFERENCES Users(id), ' + 
				'FOREIGN KEY (provider_id) REFERENCES AuthenticationProvider(id)' + 
			');'
		);
	};

	this.initialize = function() {
		this.connect();
		this.initialize_db();
		db.mysql.end();

		global.db = orm.connect("mysql://" + db.user + ":" + db.password + "@" + db.host + "/" + db.name, function (err, db) {
			return err ? console.log("models.js: error connecting to db " + err) : console.log('connected!');
		});
	};

	this.delete = function() {
		this.connect();
		db.mysql.query('DROP DATABASE ' + db.name).end();
	};

	return this;
}();
/*jshint -W062 */