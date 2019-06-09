var express = require('express');
var router = express.Router();

const Post = require('../models/post')
const User = require('../models/user')


/* GET home page. */
router.get('/', async function(req, res, next) {
	Post.find({}).populate('post_by').exec(function(err, p) {
		if (err) {return next(err)};
		res.render('index', { posts: p});
	});

		/*, async (err, posts) => {
		posts[0].populate('post_by').exec(function(err, p) {
			console.log('in populate')
			console.log(p)
		})
		console.log("one post")
		console.log(posts[0].post_by.username)
		console.log("all posts home")
		console.log(posts)
		res.render('index', { posts: posts});
	});*/
});

router.get('/test', function(req, res) {
	if(!loggedIn) {
		return res.status(401).send();
	}
	return res.status(200).send("Welcome");
})

module.exports = router;
