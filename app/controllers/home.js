/** 
 * Show home page 
 */
exports.index = function (req, res) { 
	if (req.isAuthenticated() ){
	  res.render('home/index', { 
	  	title: 'Home',
	  	user : req.user 
	  }); 
	} else {
		res.render('home/index', { 
			title: 'Home',
			user : null 
		});
	}
};