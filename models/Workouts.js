var mongoose = require('mongoose');

var WorkoutSchema = new mongoose.Schema({
	title: String,
	exercises: [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercise'}]
});

mongoose.model('Workout', WorkoutSchema)