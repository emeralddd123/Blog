const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const loginService = require('../services/authService')
const signupService = require('../services/userService')
// const webAuthMiddleware = require('../middlewares/webAuthMidldleware')
const blogService = require('../services/blogService')

const webRouter = express.Router();

// webRouter.use(express.static('public'));
webRouter.use(cookieParser())

webRouter.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


webRouter.get('/home', async (req, res) => {
	res.render('home')
})


webRouter.post('/home', async (req, res) => {

})


webRouter.get('/signup', async (req, res) => {
	res.render('signup')
})


webRouter.post('/signup', async (req, res) => {

})


webRouter.get('/login', async (req, res) => {
	res.render('signup')
})


webRouter.post('/login', async (req, res) => {

})


webRouter.get('/activate-account', async (req, res) => {
	res.render('signup')
})


webRouter.post('/activate-account', async (req, res) => {

})


webRouter.get('/signup', async (req, res) => {
	res.render('signup')
})


webRouter.post('/signup', async (req, res) => {

})


webRouter.get('/create-blog', async (req, res) => {

	res.render('create-blog')
})

webRouter.post('/create-blog', async (req, res) => {
	
})






module.exports = webRouter;