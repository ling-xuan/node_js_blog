const express = require('express');
const router = express.Router()
const Joi = require('joi')
const passport = require('passport')
 
const User = require('../models/user')
const users_controller = require('../controllers/usersController');
const filters_controller = require('../controllers/filtersController');
 
 
router.get('/signup', users_controller.signup_get);
router.post('/signup', users_controller.signup_post);
router.get('/login', users_controller.login_get);
router.post('/login', users_controller.login_post);
router.get('/add_post', filters_controller.requireLogin, users_controller.add_post_get);
router.post('/add_post', filters_controller.requireLogin, users_controller.add_post_post);
router.get('/logout', users_controller.logout_get);

module.exports = router
