const express = require('express');
const blogRouter = express.Router();
const blogService = require('../../services/blogService');
const { authenticate, isActivated } = require('../../middlewares/authMiddleware')
const { validBlogCreation, validBlogUpdate } = require('../../middlewares/blogMiddleware')

const cloudinary = require("../../config/cloudinary.config");
const uploader = require("../../config/multer.config");

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
            return res.status(result.status).json({ message: result.message, blog: result.blog });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

})


blogRouter.use(authenticate)
blogRouter.use(isActivated)

blogRouter.get('/u/myblogs', async (req, res) => {
    try {
        const authorId = req.user._id
        const params = { ...req.query }

        const result = await blogService.myBlogService(authorId, params)

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


blogRouter.post('', uploader.single("file"), validBlogCreation, async (req, res) => {
    try {
        const authorId = req.user._id
        let imageUrl = null

        if (req.file) {
            const imageData = await cloudinary.v2.uploader.upload(req.file.path);
            if (imageData) {
                imageUrl = imageData.secure_url
            } else {
                return res.status(500).json({ error: 'File upload failed.' });
            }
        }

        const blogData = { imageUrl: imageUrl, ...req.body }

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

blogRouter.post('/:blogId/like', async (req, res) => {
    try {
        const userId = req.user._id
        const blogId = req.params.blogId

        const result = await blogService.toggleLikeBlog(userId, blogId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.log(error)
        return { status: 500, message: 'An Error Occured', error: error };
    }
})


module.exports = blogRouter