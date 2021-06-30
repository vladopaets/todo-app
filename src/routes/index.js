const express = require('express')
const router = express.Router();
const {body} = require('express-validator');

const {dashboardMiddleware, authorizedMiddleware} = require('../middlewares');

const homepage = require('../controllers/homepage');
const registerController = require('../controllers/register');
const loginController = require('../controllers/login');
const dashboard = require('../controllers/dashboard');

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

router.get('/dashboard', dashboardMiddleware, dashboard.get);
router.post(
    '/add-todo-item',
    [
        body('title')
            .not().isEmpty()
            .withMessage('Title is required'),
    ],
    dashboardMiddleware,
    dashboard.addTodo
);

router.use((req, res, next) => {
    res.render('404.pug')
})

module.exports = router;
