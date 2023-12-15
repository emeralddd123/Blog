const express = require('express');
const commentRouter = express.Router();
const commentService = require('../../services/commentService');
const { authenticate, isActivated } = require('../../middlewares/authMiddleware')

commentRouter.get('', async (req, res) => {
    try {
        const blogId = req.blogId

        const result = await commentService.getComments(blogId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.comments });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });

    }
})


commentRouter.get('/:commentId', async (req, res) => {
    try {
        const blogId = req.blogId
        const commentId = req.params.commentId
        const result = await commentService.getComment(blogId, commentId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.comment });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


commentRouter.use(authenticate)


commentRouter.post('', async (req, res) => {
    try {
        const blogId = req.blogId
        const authorId = req.user._id
        const commentData = { text, parentCommentId } = req.body

        if (!commentData.text) {
            return res.status(400).json({ error: `text required in the body` })
        }

        const result = await commentService.addComment(authorId, blogId, commentData)

        if (result.status === 201) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})


commentRouter.post('/:commentId/like', async (req, res) => {
    try {
        const userId = req.user._id
        const commentId = req.params.commentId

        const result = await commentService.toggleLikeComment(userId, commentId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.comment });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        return { status: 500, message: 'An Error Occured', error: error };
    }

})


commentRouter.put('/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId
        const userId = req.user._id
        const updateData = { text } = req.body

        if (!updateData.text) {
            return res.status(400).json({ error: `text required in the body` })
        }

        const result = await commentService.updateComment(userId, commentId, updateData)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        return { status: 500, message: 'An Error Occured', error: error };
    }

})

commentRouter.delete('/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId
        const userId = req.user._id
        const updateData = { text } = req.body

        if (!updateData.text) {
            return res.status(400).json({ error: `text required in the body` })
        }

        const result = await commentService.deleteComment(userId, commentId)

        if (result.status === 200) {
            return res.status(result.status).json({ message: result.message, data: result.data });
        } else {
            return res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        return { status: 500, message: 'An Error Occured', error: error };
    }

})


module.exports = commentRouter
