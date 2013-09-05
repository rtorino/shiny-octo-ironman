/** 
 * Show home page 
 */
exports.index = function (req, res) { 
	if (req.isAuthenticated() ){
		console.log(req.user);
	  res.render('home/private', { 
	  	title: 'Home',
	  	user : req.user 
	  }); 
	} else {
		res.render('home/public', { 
			title: 'Home',
			user : null 
		});
	}
};