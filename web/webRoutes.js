const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const marked = require('marked')
const moment = require('moment')
const authService = require('../services/authService')
const userService = require('../services/userService')
const { authenticate, isActivated } = require('../middlewares/webAuthMiddleware')
const blogService = require('../services/blogService');

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
			return res.redirect('/home') //, { message: response.message }
		} else {
			return res.render('/signup', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage') //, { error: error }
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
			return res.render('login', { message: response.message })
		} else if (response.status === 201) {
			res.cookie('jwt', response.token)
			return res.redirect('/home') //, { message: response.message }
		} else {
			return res.render('login', { message: response.message })
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, , { error: error }
	}
})


webRouter.get('/activate-account', async (req, res) => {
	let { token } = req.query
	try {
		const response = await userService.activateAccount(token)

		if (response.status === 200) {
			return res.redirect('/home')	//, { message: response.message }
		} else if (response.status === 400) {
			return res.render('activate-account', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage')	//, { error: error }
	}
})


webRouter.get('/resend-activation-mail', async (req, res) => {
	let message = `Please Activate your account to perform ths action`
	try {
		return res.render('resend-activation', { message })
	} catch (error) {
		res.redirect('/errorPage')	//, { error: error }
	}
})


webRouter.post('/resend-activation-mail', async (req, res) => {
	try {
		let message
		const { email } = req.body
		const response = await userService.resendActivationMail(email)

	} catch (error) {
		res.redirect('/errorPage')	//, { error: error }
	}
})


webRouter.get('/forgot-password', async (req, res) => {
	let message
	res.render('forgot-password', { message })
})


webRouter.post('/forgot-password', async (req, res) => {
	try {
		const { email } = req.body
		const response = await userService.forgotPassword(email)

		if (response.status === 404) {
			return render('/forgot-password', { message: response.message })
		} else {
			return res.render('/forgot-password', { message: response.message })
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/reset-password/:token', async (req, res) => {
	let message
	res.render('reset-password', { message })
})


webRouter.post('/reset-password/:token', async (req, res) => {
	try {
		const { token } = req.params
		const { password } = req.body

		const response = await userService.resetPassword(token, password)

		if (response.status === 200) {
			return res.redirect('/login')  //, response.message
		} else {
			console.log(response)
			return res.redirect('/forgot-password')  //, { message: response.message }
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/blogs/:slugOrId', async (req, res) => {
	try {
		const { slugOrId } = req.params
		const response = await blogService.getBlog(slugOrId)

		if (response.status === 200) {
			const blog = response.blog
			blog.body = marked.parse(blog.body)
			return res.render('blog', { message: response.message, blog: blog, author: response.author, moment })
		} else {
			return res.render('blog', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/blogs/tags/:tag', async (req, res) => {
	try {
		const { tag } = req.params
	} catch (error) {
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/errorPage', async (req, res) => {
	let message
	res.render('errorPage', { message })
})


webRouter.use(authenticate)

webRouter.get('/my-blogs', async (req, res) => {
	try {
		const params = req.query
		const authorId = req.user._id

		const response = await blogService.myBlogService(authorId, params)
		if (response.status === 200) {
			return res.render('my-blogs', { data: response.data, message: response.message, moment })  // response.message
		} else {
			return res.redirect('home')	//, { message: response.message }
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/my-blogs/:slugOrId', async (req, res) => {
	try {
		const { slugOrId } = req.params
		const userId = req.user._id

		const response = await blogService.getMyBlog(userId, slugOrId)

		if (response.status === 200) {
			const blog = response.blog
			blog.body = marked.parse(blog.body)
			return res.render('my-blog', { message: response.message, blog: blog, moment })
		} else {
			return res.render('blog', { message: response.message })
		}
	} catch (error) {
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.get('/logout', (req, res) => {
	try {
		res.clearCookie('jwt')
		res.redirect('/')
	} catch (error) {

		res.redirect('/errorPage')
	}
});



webRouter.use(isActivated)


webRouter.get('/create-blog', async (req, res) => {
	try {
		let message
		return res.render('create-blog', { message })
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.post('/create-blog', async (req, res) => {
	try {

		const blogData = { title, description, body, tags } = req.body
		const authorId = req.user._id

		if (blogData.tags) {
			blogData.tags = blogData.tags.split(',').map((tag) => tag.trim())
		}

		const response = await blogService.createBlog(authorId, blogData)
		if (response.status === 201) {
			return res.redirect('/home')  // response.message
		} else {
			return res.render('create-blog', { message: response.message })
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}

})


webRouter.get('edit-blog/:blogId', async (req, res) => {
	try {
		const { blogId } = req.params
		const userId = req.user._id

		const response = await blogService.getMyBlog(userId, blogId)

		if (response.status === 200) {
			const blog = response.blog
			blog.body = marked.parse(blog.body)
			return res.render('edit-blog', { message: response.message, blog: blog, moment })
		} else {
			return res.redirect('my-blog')	//, { message: response.message }
		}
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})


webRouter.post('edit-blog/:blogId', async (req, res) => {
	try {
		const { blogId } = req.params
		const userId = req.user._id
		
	} catch (error) {
		console.log(error)
		res.redirect('/errorPage') //, { error: error }
	}
})
module.exports = webRouter;
