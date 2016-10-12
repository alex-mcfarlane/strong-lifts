app.controller('WorkoutCtrl', [
'$scope',
'$state',
'workout',
'workouts',
function($scope, $state, workout, workouts) {
	$scope.workout = workouts.workout;
	$scope.workout.date = new Date();

	$scope.createWorkoutEntry = function(workout) {
		var workoutEntry = {
			date: $scope.workout.date
		}

		workouts.createWorkoutEntry($scope.workout._id, workoutEntry).success(function(data){
			$state.go('workoutEntry', {id: data._id});
		});
	}
}]);