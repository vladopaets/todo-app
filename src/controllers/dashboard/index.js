module.exports = {
    get: async (req, res) => {
        
        res.render('./dashboard/index', {
            title: 'Dashboard',
            isUserLoggedIn: true,
            isDashboard: true
        })
    }
}
