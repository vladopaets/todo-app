const {validationResult} = require('express-validator');
const TodoModel = require('../../models/todo');

async function getTodoItems(userId) {
	try {
		return await TodoModel.find({user: userId});
	} catch (e) {
		console.error('Can not get todo items ', e.message);
		
		return [];
	}
}

module.exports = {
	get: async (req, res) => {
		let todoItems = await getTodoItems(req.session.user._id);
		
		res.render('./dashboard/todo-list', {
			title: 'Todo: Dashboard',
			todoItems,
			isUserLoggedIn: true,
			isDashboard: true,
		})
	},
	addTodo: async (req, res) => {
		let todoItems = await getTodoItems(req.session.user._id);
		const validationErrors = validationResult(req);
		
		if (validationErrors.isEmpty()) {
			try {
				const todoItem = new TodoModel({
					title: req.body.title,
					checked: false,
					user: req.session.user._id
				})
				
				await todoItem.save();
				
				res.redirect('/dashboard/todo-list');
				return;
			} catch (e) {
				console.error('Can not add new todo item ', e.message);
			}
		}
		
		const errors = validationErrors.array();
		let errorMsg = '';
		
		if (errors.length > 0) {
			errorMsg = errors[0].msg;
		}
		
		res.render('./dashboard/todo-list', {
			title: 'Todo: Dashboard',
			errorMsg,
			todoItems,
			isUserLoggedIn: true,
			isDashboard: true,
		})
	},
	removeTodo: async (req, res) => {
		if (req.body.hasOwnProperty('id')) {
			const result = await TodoModel.deleteOne({ _id: req.body.id });
			
			console.log(result)
		}
		
		res.redirect('/dashboard/todo-list');
	},
	checkTodo: async (req, res) => {
		if (req.body.hasOwnProperty('id')) {
			const isChecked = req.body.hasOwnProperty('status');
			
			const result = await TodoModel.updateOne({ _id: req.body.id }, { checked: !isChecked });
			
			console.log(result)
		}
		
		res.redirect('/dashboard/todo-list');
	}
}
