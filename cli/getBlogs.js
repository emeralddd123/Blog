const blogService = require('../services/blogService')
const chalk = require('chalk')

const list = async (params) => {
    const result = await blogService.getBlogs(params)
    const blogs = result.data.blogs

    if (blogs.length === 0) {
        (chalk.yellow('No Blog found'));
        process.exit(0);
    }


    (`${blogs.length} blogs Fetched Succesfully!!!`)
    ('Blog list: ');
    blogs.forEach((blog) => {
        (chalk.green('---> Title:', blog.title.substring(0, 40)));
        (chalk.green('    Description:', blog.description.substring(0, 40)));
        (chalk.green('    Tags:', blog.tags));
        ();
    });
    process.exit(0);
}


module.exports = list