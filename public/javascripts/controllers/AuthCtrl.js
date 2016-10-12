app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){

	$scope.login = function() {
		auth.login($scope.user).error(function(error){
			$scope.error = error.message;
		}).then(function(){
			$state.go('home');
		});
	}

	$scope.register = function() {
		auth.register($scope.user).error(function(error){
			$scope.error = error.message;
		}).then(function(){
			$state.go('home');
		});
	}

}]);