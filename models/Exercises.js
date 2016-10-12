var mongoose = require('mongoose');

var ExerciseSchema = mongoose.Schema({
	title: String,
});

mongoose.model('Exercise', ExerciseSchema);