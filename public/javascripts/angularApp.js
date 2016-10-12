var app = angular.module('strongLifts', ['ui.router', 'ngAnimate', 'ngAria', 'ngMaterial']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()) {
					$state.go('home');
				}
			}]
		})
		.state('register', {
			url: '/register',
			templateUrl: '/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', function($state, auth){
				if(auth.isLoggedIn()) {
					$state.go('home');
				}
			}]
		})
		.state('home', {
			url: '/home',
			onEnter: ['$state', 'auth', function($state, auth){
				if(!auth.isLoggedIn()) {
					$state.go('login');
				}
			}],
			views: {
				'':{
					templateUrl: '/home.html',
					controller: 'MainCtrl',
					resolve: {
						workoutPromise: ['workouts', function(workouts){
							return workouts.getAll();
						}]
					},
					onEnter: ['$state', 'auth', function($state, auth){
						if(!auth.isLoggedIn()) {
							$state.go('login');
						}
					}],
				},
				'workoutEntries@home':{
					templateUrl: '/workoutEntries.html',
					controller: 'WorkoutEntryCtrl',
					resolve: {
						workoutEntriesPromise: ['workoutEntries', function(workoutEntries){
							return workoutEntries.all();
						}]
					}
				}
			}
		})
		.state('home.workout', {
			url: '/workout/{id}',
			templateUrl: '/workout.html',
			controller: 'WorkoutCtrl',
			resolve: {
				workout: ['$stateParams', 'workouts', function($stateParams, workouts){
					return workouts.get($stateParams.id);
				}]
			},
			onEnter: ['$state', 'auth', function($state, auth){
				if(!auth.isLoggedIn()) {
					$state.go('login');
				}
			}],
		})
		.state('workoutEntry', {
			url: '/workoutEntry/{id}',
			templateUrl: '/workoutEntry.html',
			controller: 'WorkoutEntryCtrl',
			resolve: {
				workoutEntryPromise: ['$stateParams', 'workoutEntries', function($stateParams, workoutEntries){
					return workoutEntries.get($stateParams.id);
				}]
			}
		});

	$urlRouterProvider.otherwise('login');
}]);