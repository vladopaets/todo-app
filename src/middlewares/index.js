module.exports = {
    dashboardMiddleware: (req, res, next) => {
        if(!req.session.user || !req.cookies.user_sid) {
            res.redirect('/login');
        } else {
            next();
        }
    },
    authorizedMiddleware: (req, res, next) => {
        console.log(req.session.user)
        if(req.session.user && req.cookies.user_sid) {
            res.redirect('/dashboard');
        } else {
            next();
        }
    }
}