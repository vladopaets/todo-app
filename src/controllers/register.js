const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const UserModel = require('../models/user');

module.exports = {
    get: (req, res) => {
        res.render('register', {
            title: 'Todo: Create an account',
        })
    },
    createUser: async (req, res) => {
        const validationErrors = validationResult(req);
        const errors = {};
        let errorMsg = '';

        if (validationErrors.isEmpty()) {
            try {
                const user = await UserModel.findOne({
                    email: req.body.email
                })

                if (user) {
                    errorMsg = 'User already exist';
                } else {
                    const newUser = new UserModel(req.body);
                    const salt = await bcrypt.genSalt(3);
                    newUser.password = await bcrypt.hash(newUser.password, salt);

                    await newUser.save();

                    req.session.user = newUser;
                    res.redirect('/dashboard');

                    return;
                }
            } catch (e) {
                console.error(e)
            }
        }

        validationErrors.array().forEach(error => errors[error.param] = error.msg)

        res.render('register', {
            title: 'Create an account',
            errorMsg: errorMsg,
            errors: errors,
            values: req.body
        })
    }
};