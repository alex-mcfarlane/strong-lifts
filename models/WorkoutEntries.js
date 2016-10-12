var mongoose = require('mongoose');

var WorkoutEntrySchema = new mongoose.Schema({
	workout: {type: mongoose.Schema.Types.ObjectId, ref:'Workout'},
	date: Date,
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	exercises: [{
		exercise: {type: mongoose.Schema.Types.ObjectId, ref:'Exercise'},
		sets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Set'}]
	}]
});

mongoose.model('WorkoutEntry', WorkoutEntrySchema);