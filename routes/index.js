var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var Workout = mongoose.model('Workout');
var WorkoutEntry = mongoose.model('WorkoutEntry');
var Exercise = mongoose.model('Exercise');
var Set = mongoose.model('Set');
var User = mongoose.model('User');

//auth var route authentication
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/*
 * Authentication routes
 */
router.post('/register', function(req, res, next){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var confirmPassword = req.body.confirmPassword;

	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}
	User.findOne({
		'username': username
	}, function(notFound, existingUser){
		if(existingUser) {
			return res.status(400).json({message: "Username exists, please choose another"});
		}
		else{
			var user = new User();

			if(!user.confirmPassword(password, confirmPassword)) {
				return res.status(400).json({message: 'Passwords do not match.'});
			}
			
			user.name = name;
			user.username = req.body.username;
			user.setPassword(req.body.password);

			user.save(function(err){
				if(err) {
					return next(err);
				}

				return res.json({token: user.generateJWT()});
			});
		}
	})
});

router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'Please fill out all fields.'});
	}

	passport.authenticate('local', function(err, user, info){
		if(err) {
			return next(err);
		}

		if(user) {
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});

/*
 * Workout routes
 */
router.param('workout', function(req, res, next, id){
	var query = Workout.findById(id);

	query.exec(function(err, workout){
		if(err) {
			return next(err);
		}
		if(!workout) {
			return next(new Error('can\'t find workout'));
		}

		workout.populate('exercises', function(err, workout){
			if(err) {
				return next(err);
			}

			req.workout = workout;
			return next();
		});
	});
});

router.get('/workouts', function(req, res, next){
	Workout.find().populate('exercises').exec(function(err, workouts){
		if(err) {
			return next(err);
		}
		res.json(workouts);
	});
});

router.get('/workouts/:workout', function(req, res){
	req.workout.populate('exercises', function(err, workout){
		if(err) {
			return next(err);
		}
		res.json(req.workout);
	});
});

router.post('/workouts', auth, function(req, res, next){
	var workout = new Workout(req.body);

	workout.save(function(err, workout){
		if(err) {
			return next(err);
		}

		res.json(workout);
	})
});

router.post('/workouts/:workout/exercises/:exercise', auth, function(req, res, next){
	req.workout.exercises.push(req.exercise);
	req.workout.save(function(err, workout){
		if(err) {
			return next(err);
		}
		res.json(workout);
	});
});

router.post('/workouts/:workout/workoutEntry', auth, function(req, res, next){
	var workoutEntry = new WorkoutEntry(req.body);
	workoutEntry.workout = req.workout;

	User.findOne({username: req.payload.username}, function(err, user){
		workoutEntry.user = user;
		
		for(var i=0; i < req.workout.exercises.length; i++) {
			var exercise = req.workout.exercises[i];
			workoutEntry.exercises.push({
				exercise: exercise,
				sets: []
			});
		}

		workoutEntry.save(function(err, workoutEntry){
			if(err) {
				return next(err);
			}

			workoutEntry.populate('exercises.exercise', function(err, workoutEntry){
				if(err) {
					return next(err);
				}

				res.json(workoutEntry);
			});
		});
	});
});

/*
 * Workout Entry Routes
 */
router.param('workoutEntry', function(req, res, next, id){
	WorkoutEntry.findById(id, function(err, workoutEntry){
		if(err) {
			return next(err);
		}
		if(!workoutEntry) {
			return next(new Error('can\'t find workout entry'));
		}

		workoutEntry.populate('workout', function(err, workoutEntry){
			if(err) {
				return next(err);
			}

			workoutEntry.populate('exercises.exercise').populate('exercises.sets', function(err, workoutEntry){
				if(err) {
					return next(err);
				}
				
				req.workoutEntry = workoutEntry;
				return next();
			});
		});
	});
});

router.get('/workoutEntry', auth, function(req, res, next){
	WorkoutEntry.find({user: req.payload._id}).populate('workout').exec(function(err, workoutEntries){
		if(err){
			return next();
		}

		res.json(workoutEntries);
	})
});

router.get('/workoutEntry/:workoutEntry', auth, function(req, res, next){
	res.json(req.workoutEntry);
});

router.post('/workoutEntry/:workoutEntry/exercises/:exerciseId/sets', auth, function(req, res, next){
	req.workoutEntry.exercises.filter(function(exercise){
		if(exercise._id == req.params.exerciseId) {
			set = new Set(req.body);
			set.save(function(err, set){
				if(err) {
					return next(err);
				}

				exercise.sets.push(set);
				req.workoutEntry.save(function(err, workoutEntry){
					if(err) {
						return next(err);
					}

					res.json(set);
				})
			})
		}
	});
});

router.put('/workoutEntry/:workoutEntry', auth, function(req, res, next){
	if(req.body.date) {
		req.workoutEntry.date = req.body.date;
	}

	req.workoutEntry.save(function(err, workoutEntry){
		if(err) {
			next(err);
		}

		res.json(req.workoutEntry);
	})
});

router.delete('/workoutEntry/:workoutEntry', auth, function(req, res, next){
	WorkoutEntry.remove({_id: req.workoutEntry._id}, function(err){
		if(err) {
			return next(err);
		}

		res.json('Workout deleted');
	})
});

/*
 * Set routes
 */
router.put('/sets/:setId', function(req, res, next){
	var query = {'_id': req.params.setId};
	var newData = {
		'weight': req.body.weight,
		'sets': req.body.sets,
	};

	Set.findOneAndUpdate(query, {$set:newData}, {new: true}, function(err, set){
		if(err) {
			return next(err);
		}

		res.json(set);
	});
});

router.delete('/sets/:setId', function(req, res, next){
	Set.remove({_id: req.params.setId}, function(err) {
		if(err) {
			return next(err);
		}
		res.json('deleted');
	})
});

/*
 * Exercise routes
 */
router.param('exercise', function(req, res, next, id){
	var query = Exercise.findById(id);

	query.exec(function(err, exercise){
		if(err) {
			return next(err);
		}
		if(!exercise) {
			return next(new Error('can\'t find exercise'));
		}

		req.exercise = exercise;
		return next();
	});
});

router.post('/exercises', function(req, res, next){
	var exercise = new Exercise(req.body);

	exercise.save(function(err, exercise){
		if(err) {
			return next(err);
		}

		res.json(exercise);
	})
})

router.get('/exercises', function(req, res, next){
	Exercise.find(function(err, exercises){
		if(err) {
			return next(err);
		}
		res.json(exercises);
	});
});

router.get('/exercises/:exercise', function(req, res, next){
	res.json(req.exercise);
});

module.exports = router;
