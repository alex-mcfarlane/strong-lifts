app.service('workouts', ['$http', 'auth', function($http, auth){
	var o = {
		workouts: [],
		workout: {}
	};

	o.getAll = function() {
		return $http.get('/workouts').success(function(data){
			angular.copy(data, o.workouts);
		});
	}

	o.get = function(id) {
		return $http.get('/workouts/' + id).success(function(res){
			o.workout = res;
		});
	}

	o.createWorkoutEntry = function(workoutId, workoutEntry) {
		return $http.post('/workouts/'+workoutId+'/workoutEntry', workoutEntry, {
			headers: {
				Authorization: 'Bearer '+auth.getToken()
			}
		}).success(function(data){
			angular.copy(data, o.workoutEntry);
		});
	}

	return o;
}]);