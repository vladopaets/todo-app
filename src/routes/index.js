const express = require('express')
const {body} = require('express-validator');

const {dashboardMiddleware, authorizedMiddleware} = require('../middlewares');

const homepage = require('../controllers/homepage');
const registerController = require('../controllers/register');
const loginController = require('../controllers/login');
const dashboardController = require('../controllers/dashboard');
const todoListController = require('../controllers/dashboard/todo-list');
const teamsController = require('../controllers/dashboard/teams');
const categoriesController = require('../controllers/dashboard/categories');

const router = express.Router();

router.get('/', homepage.get);

router.get('/register', authorizedMiddleware, registerController.get);
router.post(
    '/register',
    [
        body('firstName')
            .trim()
            .not().isEmpty()
            .withMessage('First name can not be empty'),
        body('lastName')
            .trim()
            .not().isEmpty()
            .withMessage('First name can not be empty'),
        body('email')
            .isEmail()
            .withMessage('This email is not valid')
            .trim()
            .normalizeEmail(),
        body('password')
            .not().isEmpty()
            .isLength({min: 6})
            .withMessage('Password should have at least 6 characters'),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords don't match");
                } else {
                    return value;
                }
            })

    ],
    registerController.createUser
)
router.get('/login', authorizedMiddleware, loginController.get);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

router.get('/dashboard/', dashboardMiddleware, dashboardController.get);
router.get('/dashboard/todo-list', dashboardMiddleware, todoListController.get);
router.post(
    '/add-todo-item',
    [
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
    ],
    dashboardMiddleware,
    todoListController.addTodo
);
router.post('/remove-todo-item', dashboardMiddleware, todoListController.removeTodo)
router.post('/check-todo-item', dashboardMiddleware, todoListController.checkTodo)
router.get('/dashboard/teams', dashboardMiddleware, teamsController.get)
router.get('/dashboard/categories', dashboardMiddleware, categoriesController.get)

router.use((req, res, next) => {
    res.render('404.pug')
})

module.exports = router;
