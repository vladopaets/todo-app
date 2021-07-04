
module.exports = {
	get: async (req, res) => {
		
		res.render('./dashboard/teams', {
			title: 'Teams',
			isUserLoggedIn: true,
			isDashboard: true
		})
	}
}
