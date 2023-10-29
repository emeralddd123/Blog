const Blog = require('../models/blog')
const User = require('../models/user')
const utils = require('../services/utils')
const mongoose = require('mongoose')

const logger = require('../logger/index')

const createBlog = async (authorId, blogData) => {
    try {

        const { title, description, body, tags } = blogData
        const reading_time = utils.calculateReadingTime(body)
        const slug = utils.slugIt(title)

        const newBlog = await Blog.create({
            slug: slug,
            title: title,
            description: description,
            body: body,
            tags: tags,
            author: authorId,
            reading_time: reading_time
        });
        logger.info(`user with id : ${authorId} created a blogpost ${newBlog._id} succesfully`)
        return { status: 201, message: `Blog Created Succesfully`, blog: newBlog }

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user with id: ${authorId} tried to create a blogpost \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const getBlogs = async (params) => {
    try {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const skip = (page - 1) * limit;
        const search = params.q || '';
        const author = params.author || null;
        const title = params.title || null;
        const tags = params.tags ? params.tags : null;
        const orderBy = params.orderBy || '-timestamp';

        const searchCriteria = {
            $or: [
                { author: author },
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: tags } },
            ], state: 'published'
        }

        const blogs = await Blog.find(searchCriteria)
            .populate('author')
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();

        const total = await Blog.countDocuments(searchCriteria);

        const totalPage = Math.ceil(total / limit);
        logger.info(`BlogPosts fetched Succesfully`)

        return { status: 200, message: `success`, data: { blogs, page, limit, total, totalPage } }

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while fetching blogposts \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }

}


const getBlog = async (blogIdOrSlug) => {
    try {
        let blog;

        if (mongoose.Types.ObjectId.isValid(blogIdOrSlug)) {
            blog = await Blog.findOne({
                _id: blogIdOrSlug,
                state: 'published'
            });
        } else {
            blog = await Blog.findOne({
                slug: blogIdOrSlug,
                state: 'published'
            });
        }

        if (blog) {
            blog.read_count += 1
            await blog.save()
            const author = await User.findById(blog.author)
            const authorData = { ...author._doc };
            delete authorData['password'];

            logger.info(`BlogPost with idOrSlug: ${blogIdOrSlug} returned Succesfully`)

            return { status: 200, message: `Blog Fetched Succesfully`, blog: blog, author: authorData }

        } else {
            logger.info(`BlogPost with idOrSlug: ${blogIdOrSlug} not Found`)
            return { status: 404, message: `Blog Not Found` }
        }


    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while fetching blogpost with id: ${blogIdOrSlug} \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const updateBlog = async (authorId, blogId, updateBlogData) => {
    try {

        const blogExist = await Blog.findOne({ _id: blogId, author: authorId });

        if (!blogExist) {
            return { status: 404, message: `Blog with ID ${blogId} not found or doesn't belong to you` };
        }
        let slug
        let reading_time
        if (updateBlogData.body) {
            reading_time = utils.calculateReadingTime(updateBlogData.body)
        }
        if (updateBlogData.title) {
            slug = utils.slugIt(updateBlogData.title)
        }

        blogExist.title = updateBlogData.title || blogExist.title;
        blogExist.description = updateBlogData.description || blogExist.description;
        blogExist.tags = updateBlogData.tags || blogExist.tags;
        blogExist.body = updateBlogData.body || blogExist.body;
        blogExist.slug = slug || blogExist.slug;
        blogExist.reading_time = reading_time || blogExist.reading_time;
        blogExist.state = updateBlogData.state || blogExist.state


        await blogExist.save();

        logger.info(`User with id: ${authorId} updated blog: ${blogId} succesfully`)

        return { status: 200, message: 'Blog updated successfully', blog: blogExist };

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user with id: ${authorId} trying to update blog: ${blogId} \n ${error}`)
        return { status: 500, message: 'Error updating the blog', error };
    }
}


const deleteBlog = async (authorId, blogId) => {
    try {
        const blog = Blog.findOneAndDelete({ author: authorId, _id: blogId })

        if (!blog) {
            return { status: 404, message: `Blog with ID ${blogId} not found or doesn't belong to you` };
        }
        logger.info(`User with id: ${authorId} deleted blog: ${blogId} succesfully`)

        return { status: 200, message: `Blog with ID ${blogId}  deleted succesfully`, blog }

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user with id: ${authorId} trying to delete blog: ${blogId} \n ${error}`)
        return { status: 500, message: 'Error deleting the blog', error };
    }
}

const publishBlog = async (authorId, blogId) => {
    try {
        const blog = await Blog.findOne({ author: authorId, _id: blogId })

        if (!blog) {
            return { status: 404, message: `Blog with ID ${blogId} not found or doesn't belong to you` };
        }

        blog.state = 'published'
        await blog.save()

        logger.info(`User with id: ${authorId} published blog: ${blogId} succesfully`)

        const author = await User.findById(authorId)
        const authorData = { ...author._doc };
        delete authorData['password'];

        return { status: 200, message: `Blog Published Succesfully!!!`, blog, author: authorData }

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user with id: ${authorId} trying to publish blog: ${blogId} \n ${error}`)
        return { status: 500, message: 'Error publishing the blog', error };
    }
}


const myBlogService = async (authorId, params) => {
    try {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 20;
        const skip = (page - 1) * limit;
        const search = params.q || '';
        const state = params.state || ['draft', 'published'];
        const tags = params.tags ? params.tags : null;
        const orderBy = params.orderBy || '-timestamp';

        const searchCriteria = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: tags } },
            ], author: authorId,
            state: { $in: state }
        }

        const blogs = await Blog.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();

        const total = await Blog.countDocuments(searchCriteria);

        logger.info(`user: ${authorId} fetched their BlogPosts Succesfully`)

        return { status: 200, message: `Your Owned Blogs fetched succesfully`, data: { blogs, page, limit, total } }

    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user with id: ${authorId} trying to fetch their Blogs \n ${error}`)
        return { status: 500, message: `An Error Occured`, error: error }
    }

}


const blogService = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    publishBlog,
    myBlogService
}

module.exports = blogService
