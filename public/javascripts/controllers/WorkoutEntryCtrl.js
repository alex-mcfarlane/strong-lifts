app.controller('WorkoutEntryCtrl', [
'$scope',
'$state',
'$stateParams',
'workoutEntries',
function($scope, $state, $stateParams, workoutEntries) {
	$scope.workoutEntries = workoutEntries.workoutEntries;
	$scope.workoutEntry = workoutEntries.workoutEntry;

	$scope.addSet = function(exercise) {
		setNum = exercise.sets.length + 1;
		exercise.sets.push({num: setNum, isOpen: true});
	}

	$scope.removeSet = function(exercise, set, index) {
		if(set._id) {
			workoutEntries.deleteSet(set).success(function(data){
				
			});
		}
		exercise.sets.splice(index, 1);
	}

	$scope.createSet = function(exercise, set) {
		workoutEntries.createSet($scope.workoutEntry._id, exercise, set).success(function(data){
			set.isOpen = false;
		});
	}

	$scope.editSet = function(set) {
		set.isOpen = true;
	}

	$scope.cancelEdit = function(exercise, set, index) {
		if(set._id) {
			set.isOpen = false;
		}
		else{
			exercise.sets.splice(index, 1);
		}
	}

	$scope.updateSet = function(set) {
		workoutEntries.updateSet(set).success(function(data){
			set.isOpen = false;
		});
	}

	$scope.updateWorkoutEntry = function(workoutEntry) {
		workoutEntries.update(workoutEntry);
	}

	$scope.deleteWorkoutEntry = function(workoutEntry) {
		workoutEntries.delete(workoutEntry._id).success(function(res){
			$state.go('home');
		});
	}

}]);