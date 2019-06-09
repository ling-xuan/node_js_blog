const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


 
const User = require('../models/user')
const Post = require('../models/post')
const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
})
const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]/).required(),
})

exports.signup_get = function(req, res) {
    res.render('signup', {expressFlash: req.flash('error')})
}

exports.signup_post = async function(req, res) {
    try {
      const result = Joi.validate(req.body, userSchema)
      if (result.error) {
        req.flash('error', 'Data entered is not valid. Please try again.')
        res.redirect('/users/signup')
        return
      }
 
      user = await User.findOne({ 'username': result.value.username })
      if (user) {
        req.flash('error', 'username is already in use.')
        res.redirect('/users/signup')
        return
      }
      user = await User.findOne({ 'email': result.value.email })
      if (user) {
        req.flash('error', 'Email is already in use.')
        res.redirect('/users/signup')
        return
      }
 
	  const salt = await bcrypt.genSalt(10)
      const hash = await User.hashPassword(result.value.password, salt)
 
      delete result.value.confirmationPassword
      result.value.password = hash
      result.value.salt = salt
 
      const newUser = await new User(result.value)
      await newUser.save()
 
      req.flash('success', 'Registration successfully, go ahead and login.')
      res.redirect('/users/login')
 
    } catch(error) {
      next(error)
    }
}

exports.login_get = function(req, res) {
	res.render('login', {error: req.flash('error')})
}

exports.login_post = async function(req, res, next) {

	try {
      const result = Joi.validate(req.body, loginSchema)
      if (result.error) {
        req.flash('error', result.error)
        res.redirect('/users/login')
        return
      }
 
      const user = await User.findOne({ 'email': result.value.email })
      if (!user) {
        req.flash('error', 'login 2')
        res.redirect('/users/login')
        return
      }
 
	  const salt = user.salt
	  const hash = await User.hashPassword(result.value.password, salt)

	  if (hash === user.password) {
		  req.session.user = user;
		  console.log("save")
		  console.log(req.session)
		  res.redirect('/');
		  return
	  }
	  req.flash('error', ['Invalid email or password.'])
	  res.redirect('/users/login')

    } catch(error) {
		console.log(error)
      next(error)
    }
}

exports.add_post_get = function(req, res) {
	res.render('add_post', {expressFlash: req.flash('error')});
}

exports.add_post_post = [
    body('subject', 'Subject must not be empty.').isLength({ min: 1 }).trim(),
    body('body', 'Body must not be empty.').isLength({ min: 1 }).trim(),
    sanitizeBody('*').trim().escape(),
	(req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var postData = new Post(
          { subject: req.body.subject,
            body: req.body.body,
            post_by: req.user
          });

		postData.save().then( result => {
			res.redirect('/');
		}).catch(err => {
			res.status(400).send("Unable to save data");
		});
	}
];

exports.logout_get = function(req, res) {
  res.clearCookie("session");
  res.redirect('/');
}
