module.exports = {
    get: (req, res) => {
        res.render('dashboard', {title: 'Todo: Dashboard'})
    }
}