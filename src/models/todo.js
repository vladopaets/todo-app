const mongoose = require('mongoose');
const {Schema} = mongoose;

const todoSchema = new Schema({
	title: {
		type: String
	},
	checked: {
		type: Boolean
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

const TodoModel = mongoose.model('Todo', todoSchema)

module.exports = TodoModel;
