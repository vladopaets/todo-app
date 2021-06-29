module.exports = {
    get: (req, res) => {
        res.render('dashboard', {title: 'Todo: Dashboard'})
    },
    update: (req, res) => {
        console.log(req)
    }
}
