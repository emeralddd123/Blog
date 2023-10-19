const express = require('express');
const blogRouter = express.Router();
const blogService = require('../../services/blogService');
const authenticateUser = require('../../middlewares/authMiddleware')
const { validBlogCreation, validBlogUpdate } = require('../../middlewares/blogMiddleware')


blogRouter.get('', async (req, res) => {
    try {
        const params = { ...req.query }
        const result = await blogService.getBlogs(params)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


blogRouter.get('/:slugOrId', async (req, res) => {
    try {
        const slugOrId = req.params.slugOrId
        const result = await blogService.getBlog(slugOrId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, blog: result.blog, author: result.author });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

})


blogRouter.use(authenticateUser)

blogRouter.post('', validBlogCreation, async (req, res) => {
    try {
        const authorId = req.user._id
        const blogData = req.body

        const result = await blogService.createBlog(authorId, blogData)

        if (result.status === 201) {
            return res.status(result.status).json({ message: result.message, blog: result.blog });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


blogRouter.put('/:blogId', validBlogUpdate, async (req, res) => {
    try {
        const authorId = req.user._id
        const blogId = req.params.blogId
        const updateBlogData = req.body

        const result = await blogService.updateBlog(authorId, blogId, updateBlogData)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, blog: result.blog });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


blogRouter.delete('/:blogId', async (req, res) => {
    try {
        const authorId = req.user._id
        const blogId = req.params.blogId

        const result = await blogService.deleteBlog(authorId, blogId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, blog: result.blog });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

blogRouter.post('/publish/:blogId', async (req, res) => {
    try {
        const authorId = req.user._id
        const blogId = req.params.blogId

        const result = await blogService.publishBlog(authorId, blogId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, blog: result.blog });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


module.exports = blogRouter