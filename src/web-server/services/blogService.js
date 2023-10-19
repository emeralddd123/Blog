const Blog = require('../models/blog')
const User = require('../models/user')
const utils = require('../services/utils')


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

        return { status: 201, message: `Blog Created Succesfully`, blog: newBlog }

    } catch (error) {
        console.error(error);
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
        const tags = params.tags ? params.tags.split(',') : null;
        const orderBy = params.orderBy || 'timestamp';

        const searchCriteria = {
            $or: [
                { author: author },
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: tags } },
            ], state: 'published'
        }

        const blogs = await Blog.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort(orderBy)
            .exec();

        const total = await Blog.countDocuments(searchCriteria);

        return { status: 200, message: `success`, data: { blogs, page, limit, total } }

    } catch (error) {
        return { status: 500, message: `An Error Occured`, error: error }
    }

}


const getBlog = async (blogIdOrSlug) => {
    try {
        const blog = await Blog.findOne({
            $or: [
                { _id: blogIdOrSlug },
                { slug: blogIdOrSlug }
            ], state: 'published'
        })

        const author = await User.findById(blog.author)

        return { status: 200, message: `Blog Fetched Succesfully`, blog: blog, author: author }

    } catch (error) {
        return { status: 500, message: `An Error Occured`, error: error }
    }
}


const updateBlog = async (authorId, blogId, updateBlogData) => {
    try {

        const blogExist = await Blog.findOne({ _id: blogId, author: authorId });

        if (!blogExist) {
            return { status: 404, message: `Blog with ID ${blogId} not found or doesn't belong to you` };
        }
        if (updateBlogData.body) {
            const reading_time = utils.calculateReadingTime(updateBlogData.body)
        }
        if (updateBlogData.title) {
            const slug = utils.slugIt(updateBlogData.title)
        }

        blogExist.title = updateBlogData.title || blogExist.title;
        blogExist.description = updateBlogData.description || blogExist.title;
        blogExist.tags = updateBlogData.tags || blogExist.title;
        blogExist.body = updateBlogData.body || blogExist.title;
        blogExist.slug = slug || blogExist.slug;
        blogExist.reading_time = reading_time || blogExist.reading_time;
        blogExist.state = updateBlogData.state || blogExist.state


        await blogExist.save();

        return { status: 200, message: 'Blog updated successfully', blog: blogExist };

    } catch (error) {
        return { status: 500, message: 'Error updating the blog', error };
    }
}


const deleteBlog = async (authorId, blogId) => {
    try {
        const blog = Blog.findOneAndDelete({ author: authorId, _id: blogId })

        if (!blog) {
            return { status: 404, message: `Blog with ID ${blogId} not found or doesn't belong to you` };
        }
        return { status: 200, message: `Blog with ID ${blogId}  deleted succesfully`, blog }

    } catch (error) {
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

        const author = await User.findById(authorId)

        return { status: 200, message: `Blog Published Succesfully!!!`, blog, author }

    } catch (error) {
        return { status: 500, message: 'Error publishing the blog', error };
    }
}

const blogService = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    publishBlog
}

module.exports = blogService
