module.exports = {
    get: (req, res) => {
        res.render('index', {title: 'Todo: Homepage'})
    }
}