const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

module.exports = {
    get: (req, res) => {
        res.render('login', {title: 'Todo: Login'})
    },
    login: async (req, res) => {
        try {
            const user = await UserModel.findOne({email: req.body.email});

            if (!user) {
                res.render('login', {
                    title: 'Todo: Login',
                    errorMsg: 'Email or password does not match',
                    email: req.body.email
                });

                return;
            }

            const match = await bcrypt.compare(req.body.password, user.password);

            if (match) {
                req.session.user = user;
                res.redirect('/dashboard/todo-list');
            } else {
                res.render('login', {
                    title: 'Todo: Login',
                    errorMsg: 'Email or password does not match',
                    email: req.body.email
                });
            }
        } catch (e) {
            console.error(e)
        }
    },
    logout: (req, res) => {
        try {
            req.session.destroy();
            res.clearCookie('user_sid');

            res.redirect('/');
        } catch (e) {
            console.error(e)
        }
    }
}
