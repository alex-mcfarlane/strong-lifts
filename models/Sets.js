var mongoose = require('mongoose');

var SetSchema = new mongoose.Schema({
	num: Number,
	weight: Number,
	reps: Number,
});

mongoose.model('Set', SetSchema);