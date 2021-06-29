const mongoose = require('mongoose');
const {Schema} = mongoose;

const todoSchema = new Schema({
	title: {
		type: String
	},
	checked: {
		type: Boolean
	}
})
