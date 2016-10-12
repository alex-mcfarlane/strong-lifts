app.controller('MainCtrl', [
'$scope',
'$state',
'workouts',
function($scope, $state, workouts) {
	$scope.workouts = workouts.workouts;

	$scope.addWorkoutEntry = function(workout) {
		$scope.workoutEntries.push({title: workout.title})
	};

	$scope.createWorkoutEntry = function(workout) {
		var workoutEntry = {
			date: new Date()
		}

		workouts.createWorkoutEntry(workout._id, workoutEntry).success(function(data){
			$state.go('workoutEntry', {id: data._id});
		});
	}
}]);