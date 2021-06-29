module.exports = {
    get: (req, res) => {
        const isUserLoggedIn = req.session.user && req.cookies.user_sid;
        res.render('index', {title: 'Todo: Homepage', isUserLoggedIn})
    }
}
