
module.exports = {
	get: async (req, res) => {
		
		res.render('./dashboard/categories', {
			title: 'Categories',
			isDashboard: true,
			isUserLoggedIn: true
		})
	}
}
