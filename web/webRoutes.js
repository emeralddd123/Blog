const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const moment = require('moment')
const authService = require('../services/authService')
const userService = require('../services/userService')
const webAuthMiddleware = require('../middlewares/webAuthMidldleware')
const blogService = require('../services/blogService')

const webRouter = express.Router();

// webRouter.use(express.static('public'));
webRouter.use(cookieParser())

webRouter.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


webRouter.get('/home', async (req, res) => {
	try {
		const params = req.query
		const response = await blogService.getBlogs(params)
		if (response.status === 200) {
			return res.render('home', { data: response.data, message: response.message, moment })
		}

	} catch (error) {
		res.redirect('/errorPage')
	}

})


webRouter.post('/home', async (req, res) => {

})


webRouter.get('/signup', async (req, res) => {
	let message
	res.render('signup', { message })
})


webRouter.post('/signup', async (req, res) => {
	try {
		const userData = { firstname, lastname, email, password, phonenumber } = req.body

		const response = await userService.signup(userData)

		if (response.status === 409) {
			return res.redirect('/signup', { message: response.message })
		} else if (response.status === 201) {
			return res.redirect('/home', { message: response.message })
		} else {
			return res.redirect('/signup', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage', { error: error })
	}
})


webRouter.get('/login', async (req, res) => {
	let message
	res.render('login', { message })
})


webRouter.post('/login', async (req, res) => {
	try {
		const loginData = { email, password } = req.body

		const response = await authService.login(loginData)

		if (response.status === 401) {
			return res.redirect('/login', { message: response.message })
		} else if (response.status === 201) {
			res.cookie('jwt', response.token)
			return res.redirect('/home', { message: response.message })
		} else {
			return res.redirect('/login', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage', { error: error })
	}
})


webRouter.get('/activate-account', async (req, res) => {
	let { token } = req.query
	try {
		const response = await userService.activateAccount(token)
		if (response.status === 400) {
			return res.redirect('/activate-account', { message: response.message })
		}
		if (response.status === 200) {
			return res.redirect('/home', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage', { error: error })
	}
})


webRouter.get('/resend-activation-mail', async (req, res) => {
	let message
	try {
		return res.render('resend-activation', { message })
	} catch (error) {
		res.redirect('/errorPage', { error: error })
	}
})

webRouter.post('/resend-activation-mail', async (req, res) => {
	try {
		let message
		const {email} = req.body
		const response = await userService.resendActivationMail(email)
		
	} catch (error) {
		
	}
})


webRouter.get('/forgot-password', async (req, res) => {
	res.render('forgot-password')
})


webRouter.post('/forgot-password', async (req, res) => {
	const { email } = req.body
	const response = await userService.forgotPassword(email)

	if (response.status === 404) {
		return redirect('/forgot-password', { message: response.message })
	}
	if (response.status === 200) {
		return redirect('/forgot-password', { message: response.message })
	}
})


webRouter.get('/reset-password', async (req, res) => {
	let message
	res.render('reset-password', { message })
})


webRouter.post('/reset-password', async (req, res) => {
	const { token } = req.query
	const { password } = req.body

	const response = await userService.resetPassword(token, password)

	if (response.status === 200) {
		return redirect('/login', response.message)
	} else {
		return redirect('/forgot-password', { message: response.message })
	}
})


webRouter.get('/create-blog', async (req, res) => {

	res.render('create-blog')
})

webRouter.post('/create-blog', async (req, res) => {

})






module.exports = webRouter;