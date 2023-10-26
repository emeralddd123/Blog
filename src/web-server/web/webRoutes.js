const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const loginService = require('../services/authService')
const signupService = require('../services/userService')
// const webAuthMiddleware = require('../middlewares/webAuthMidldleware')
const blogService = require('../services/blogService')

const webRouter = express.Router();

webRouter.use(express.static('public'));
webRouter.use(cookieParser())

webRouter.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


webRouter.get('/', async (req, res) => {
	
})







module.exports = webRouter;