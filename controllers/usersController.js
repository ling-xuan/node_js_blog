
exports.login_get = function(req, res) {
	res.render('login', {expressFlash: req.flash('error')});
}

exports.login_post = function(req, res) {
	res.render('login', {expressFlash: req.flash('error')});
}
