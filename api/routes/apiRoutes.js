const express = require('express');
const apiRouter = express.Router();

const userRouter = require('./userRouter')
const blogRouter = require('./blogRouter')
const authRouter = require('./authRouter')
const commentRouter = require('./commentRouter')

const {forwardParam} = require('../../middlewares/otherMiddlewares')

apiRouter.use('/users', userRouter);
apiRouter.use('/blogs/:blogId/comments', forwardParam('blogId'), commentRouter);
apiRouter.use('/blogs', blogRouter);
apiRouter.use('/auth', authRouter)

module.exports = apiRouter;
