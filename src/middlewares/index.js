const UserModel = require('../models/user');

module.exports = {
    dashboardMiddleware: async (req, res, next) => {
        if(!req.session.user || !req.cookies.user_sid) {
            res.redirect('/login');
        } else {
            next();
        }
    },
    authorizedMiddleware: (req, res, next) => {
        if(req.session.user && req.cookies.user_sid) {
            res.redirect('/dashboard');
        } else {
            next();
        }
    }
}
