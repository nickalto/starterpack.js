var assert = require("assert")
var sql = require('../sql');
var db_init = require("../sql_init");
var bcrypt = require("bcrypt");

/* Note - to run tests type: 'mocha' -NA */

describe('Connection', function(){
	db_init.initialize();
	var db = db_init.connect();
	var models = sql.models;

	describe('create_db', function(){
		it('should initialize db if not already initialized', function(done){
			db.query("SHOW DATABASES LIKE 'transcriptorize';", 
				function(err, rows, fields) {
					assert(err === null);
					assert(rows.length > 0);
					done();
				}
				);
		});
	});

	describe('create_user', function() {
		it('should insert user record into database', function(done) {
			var userData = {};
			userData['username'] = 'root';
			userData['password'] = 'toor';
			var testcreateuser = function(userData, userarray) {
				//test for user creation
				models.createUser(userData, function(err, items) {
					var user = userarray[0];

					assert(err === null);
					assert(user.username == userData['username']);

					bcrypt.compare(userData['password'], user.password, function(err, doesMatch){
						assert(matches);
					});

					bcrypt.compare('wrongpassword', user.password, function(err, doesMatch){
						assert(!matches);
					});

					done();
				});
			}

			models.User.find({ username:userData['username'] }, function(err, userarray) {
				if(userarray.length > 0) {
					userarray[0].remove(function(err) {
						testcreateuser(userData, userarray);
					});
				} else {
					testcreateuser(userData, userarray);
				}
			});

		});
	});

});