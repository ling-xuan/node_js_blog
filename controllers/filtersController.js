const User = require('../models/user')
// for pages that requires login, redirect to home
exports.requireLogin = async function(req, res, next) {
  if (!req.user) {
    res.redirect('/users/login');
	return;
  }
  user = await User.findOne({ 'username': req.user });
  if (!user) {
    res.redirect('/users/login');
  } else {
    next();
  }
};

// example
/*
app.get('/dashboard', requireLogin, function(req, res) {
  res.render('dashboard.jade');
});

*/
