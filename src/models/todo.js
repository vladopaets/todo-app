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

const TodoModel = mongoose.model('Todo', todoSchema)

module.exports = TodoModel;
