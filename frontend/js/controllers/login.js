function LoginController($scope, $http) {
  $scope.createUser = function() {
    this.loginModel = _.pick($scope, 'first_name', 'last_name', 'username', 'email_address', 'password');
    $http({
        method : 'POST',
        url : '/user/create',
        data : this.loginModel
    })
  	.success(function(data, status, headers, config) {
  		if(data.success) {
  			window.location = data.redirect;
  		} else {
        Object.keys(data.error).forEach(function (key) {
          $('body').append('<p class="error">' + data.error[key] + '</p>')
        });
      }
  	})
  	.error(function(data, status, headers, config) {
  		console.log('create user failure');
  	});
  };

  $scope.authenticateUser = function() {
  	$scope.loginModel = _.pick($scope, 'username', 'password');;
    console.log('authenticate');
    $http({
        method : 'POST',
        url : '/login',
        data : this.loginModel,
    })
  	.success(function(data, status, headers, config) {
      console.log('hoooyahhh' + JSON.stringify(data));
  		if(data.success) {
  			console.log('authentication success');
  			window.location = data.redirect;
  		} else {
  			$( "input[type='password']" ).val('');
  		}
  	})
  	.error(function(data, status, headers, config) {
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
