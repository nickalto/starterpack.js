function LoginController($scope, $http) {
  $scope.createUser = function() {
    $scope.loginModel = {};
    this.loginModel.username = this.username;
    this.loginModel.password = this.password;
    this.loginModel.firstname = this.firstname;
    this.loginModel.lastname = this.lastname;
    this.loginModel.email = this.email;
    $http({
        method : 'POST',
        url : '/user/create',
        data : this.loginModel
    }).
  	success(function(data, status, headers, config) {
  		if(data.success) {
  			console.log('create user success');
  			window.location = data.redirect;
  		}
  	}).
  	error(function(data, status, headers, config) {
  		console.log('create user failure');
  	});
  };

  $scope.authenticateUser = function() {
  	$scope.loginModel = {};
    this.loginModel.username = this.username;
    this.loginModel.password = this.password;
    console.log('authenticate');
    $http({
        method : 'POST',
        url : '/user/read',
        data : this.loginModel
    }).
  	success(function(data, status, headers, config) {
  		if(data.success) {
  			console.log('authentication success');
  			window.location = data.redirect;
  		} else {
  			$( "input[type='password']" ).val('');
  		}
  	}).
  	error(function(data, status, headers, config) {
  		console.log('authentication failure');
  	});
  };

  $scope.initializeUpdate = function(user) {
    _.extend($scope, user);
  };

  $scope.updateUser = function() {
    var updateModel = _.pick($scope, 'id', 'first_name', 'last_name', 'username', 'email_address');
    $http({
        method : 'POST',
        url : '/user/update',
        data : updateModel
    }).
    success(function(data, status, headers, config) {
      if(data.success) {
        console.log('update success');
      } else {
        console.log('update failure');
      }
    }).
    error(function(data, status, headers, config) {
        console.log('update failure');
    });
  };
  
  $scope.deleteUser = function() {
    $http({
        method : 'POST',
        url : '/user/delete'
    }).
    success(function(data, status, headers, config) {
      if(data.success) {
        console.log('delete success');
        window.location = data.redirect;
      } else {
        console.log('delete failure');
      }
    }).
    error(function(data, status, headers, config) {
        console.log('delete failure');
    });
  }
}
