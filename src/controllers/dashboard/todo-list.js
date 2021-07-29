const {validationResult} = require('express-validator');
const { Parser } = require('json2csv');

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
		const todoItems = await getTodoItems(req.session.user._id);
		const editableItemId = req.query.hasOwnProperty('id') ? req.query.id : '';
		const editableItem = editableItemId ? await getTodoItem(editableItemId) : null;
		
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
			const isChecked = req.body.status;
			
			const result = await TodoModel.updateOne({ _id: req.body.id }, { checked: !isChecked });
			
			console.log(result)
		}
		
		res.redirect('/dashboard/todo-list');
	},
	import: async (req, res) => {
		const todoItems = await getTodoItems(req.session.user._id);
		
		const response = {
			isUserLoggedIn: true,
			isDashboard: true,
			title: 'Todo: Dashboard',
			todoItems,
		}
		
		if (!req.files || Object.keys(req.files).length === 0) {
			res.render('./dashboard/todo-list', {
				...response,
				importError: 'No file selected',
			})
		}
		const list = req.files['todo-list'];
		
		try {
			const todoItems = JSON.parse(list.data.toString());
		
			for(let i = 0; i < todoItems.length; i++) {
				const todoItem = new TodoModel({
					title: todoItems[i].title,
					checked: false,
					user: req.session.user._id
				})
				
				await todoItem.save();

				res.redirect('/dashboard/todo-list');
			}
		} catch (error) {
			res.render('./dashboard/todo-list', {
				...response,
				importError: 'Something went wrong',
			})
		}
	},
	download: async (req, res) => {
		const todoItems = await TodoModel.find({user: req.session.user._id}).populate({ path: 'user' })

		const fields = [
			{ label: 'Title', value: 'title' },
			{ label: 'Finished', value: 'checked' },
			{ label: 'Date', value: 'date' },
			{ label: 'User first name', value: 'user.firstName' },
			{ label: 'User last name', value: 'user.lastName' },
			{ label: 'User email', value: 'user.email' }
		];
		
		const json2csv = new Parser({ fields });
		const csv = json2csv.parse(todoItems);
		
		res.header('Content-Type', 'text/csv');
		res.attachment('todo-list.csv');
		return res.send(csv);
	}
}
