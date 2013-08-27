module.exports = {
	development: {
		db: 'mongodb://localhost:27017/shiny-octo-ironman',
		app: {
			name: 'Shiny Octo Ironman'
		}	
	},
	production: {
		db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
		app: {
			name: 'Shiny Octo Ironman'
		}
	}
};