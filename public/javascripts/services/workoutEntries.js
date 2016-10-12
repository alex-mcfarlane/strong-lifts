app.factory('workoutEntries', ['$http', 'auth', 'DateHelper', function($http, auth, DateHelper){
	var o = {
		workoutEntries: [],
		workoutEntry: {}
	};

	o.all = function() {
		return $http.get('/workoutEntry', {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).then(function(res){
			angular.copy(res.data, o.workoutEntries);

			o.workoutEntries.forEach(function(workout) {
				var dateHelper = new DateHelper(workout.date);
				
				workout.year = dateHelper.year;
				workout.month = dateHelper.month.name;
				workout.day = dateHelper.day;
			});
		});
	}

	o.get = function(id) {
		return $http.get('/workoutEntry/' + id, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).then(function(res){
			var workout = res.data;
			var dateHelper = new DateHelper(workout.date);

			workout.year = dateHelper.year;
			workout.month = dateHelper.month.name;
			workout.day = dateHelper.day;
			workout.date = new Date(workout.date);

			angular.copy(workout, o.workoutEntry);
		});
	}

	o.update = function(workoutEntry) {
		return $http.put('/workoutEntry/'+workoutEntry._id, workoutEntry, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).success(function(res) {
			o.workoutEntry = res.data;
		}, function(error){

		});
	}

	o.delete = function(id) {
		return $http.delete('/workoutEntry/'+id, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).success(function(data){
			return data;
		});
	}

	o.createSet = function(workoutId, exercise, set) {
		return $http.post('/workoutEntry/'+workoutId+'/exercises/'+exercise._id+'/sets', set, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).success(function(data){
			set._id = data._id;
			set.weight = data.weight;
			set.reps = data.reps;
		})
	}

	o.updateSet = function(set) {
		return $http.put('sets/'+set._id, set, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).success(function(data){
			set = data;
		});
	}

	o.deleteSet = function(set) {
		return $http.delete('sets/'+set._id, set, {
			headers: {
				Authorization: 'Bearer '+auth.getToken() 
			}
		}).success(function(data){

		});
	}

	return o;
}]);