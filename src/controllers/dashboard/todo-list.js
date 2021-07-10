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

async function getTodoItem(id) {
	try {
		const items =  await TodoModel.find({ _id: id });
		
		if (items.length > 0) {
			return items[0];
		}
		
		return null;
	} catch (e) {
		console.error('Can not get todo item ', e.message);
	
		return null;
	}
}

module.exports = {
	get: async (req, res) => {
		console.log(req.query)
		const todoItems = await getTodoItems(req.session.user._id);
		const editableItemId = req.query.hasOwnProperty('id') ? req.query.id : '';
		const editableItem = editableItemId ? await getTodoItem(editableItemId) : null;
		
		console.log(editableItem)
		
		res.render('./dashboard/todo-list', {
			title: 'Todo: Dashboard',
			todoItems,
			editableItem,
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
		let addItemError = '';
		
		if (errors.length > 0) {
			addItemError = errors[0].msg;
		}
		
		res.render('./dashboard/todo-list', {
			title: 'Todo: Dashboard',
			addItemError,
			todoItems,
			isUserLoggedIn: true,
			isDashboard: true,
		})
	},
	editTodo: async (req, res) => {
		let todoItems = await getTodoItems(req.session.user._id);
		const validationErrors = validationResult(req);
		
		if (validationErrors.isEmpty()) {
			try {
				await TodoModel.updateOne({ _id: req.body.id }, { title: req.body.title, checked: false });
				
				res.redirect('/dashboard/todo-list');
				return;
			} catch (e) {
				console.error('Can not add new todo item ', e.message);
			}
		}
		
		const errors = validationErrors.array();
		let editItemError = '';
		
		if (errors.length > 0) {
			editItemError = errors[0].msg;
		}
		
		res.render('./dashboard/todo-list', {
			title: 'Todo: Dashboard',
			editItemError,
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
