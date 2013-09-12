var path = require('path');
var rootPath = path.normalize(__dirname + '/..'); 

module.exports = {
	development: {
		db: 'mongodb://localhost:27017/dirty',
		root: rootPath,
		app: {
			name: 'DIRTy'
		}	
	},
	test: {
		db: 'mongodb://localhost:27017/dirty',
		root: rootPath,
		app: {
			name: 'Shiny Octo Ironman'
		}	
	},
	production: {
		db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
		root: rootPath,
		app: {
			name: 'DIRTy'
		}
	}
};