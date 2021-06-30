const {validationResult} = require('express-validator');
const TodoModel = require('../models/todo');

async function getTodoItems() {
    try {
        return await TodoModel.find({});
    } catch (e) {
        console.error('Can not get todo items ', e.message);
    
        return [];
    }
}

module.exports = {
    get: async (req, res) => {
        let todoItems = await getTodoItems();
        
        res.render('dashboard', {
            title: 'Todo: Dashboard',
            todoItems
        })
    },
    addTodo: async (req, res) => {
        let todoItems = await getTodoItems();
        const validationErrors = validationResult(req);

        if (validationErrors.isEmpty()) {
            try {
                const todoItem = new TodoModel({
                    title: req.body.title,
                    checked: false
                })
                
                await todoItem.save();
                const updateTodoItems = [...todoItems, todoItem];
                
                console.log('Added new todo item');
    
                res.render('dashboard', {
                    title: 'Todo: Dashboard',
                    errorMsg: '',
                    todoItems: updateTodoItems
                })
                
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
        
        res.render('dashboard', {
            title: 'Todo: Dashboard',
            errorMsg,
            todoItems
        })
    }
}
