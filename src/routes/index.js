const express = require('express')
const router = express.Router();
const {body} = require('express-validator');

const {dashboardMiddleware, authorizedMiddleware} = require('../middlewares');

const homepage = require('../controllers/homepage');
const register = require('../controllers/register');
const login = require('../controllers/login');
const dashboard = require('../controllers/dashboard');

router.get('/', homepage.get);

router.get('/register', authorizedMiddleware, register.get);
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
    register.createUser
)
router.get('/login', authorizedMiddleware, login.get);
router.post('/login', login.post);
router.get('/dashboard', dashboardMiddleware, dashboard.get);

router.use((req, res, next) => {
    res.render('404.pug')
})

module.exports = router;