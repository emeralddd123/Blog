const blogService = require('../services/blogService')
const chalk = require('chalk')

const list = async (params) => {
    const result = await blogService.getBlogs(params)
    const blogs = result.data.blogs

    if (blogs.length === 0) {
        console.log(chalk.yellow('No Blog found'));
        process.exit(0);
    }


    console.log(`${blogs.length} blogs Fetched Succesfully!!!`)
    console.log('Blog list: ');
    blogs.forEach((blog) => {
        console.log(chalk.green('---> Title:', blog.title.substring(0, 40)));
        console.log(chalk.green('    Description:', blog.description.substring(0, 40)));
        console.log(chalk.green('    Tags:', blog.tags));
        console.log();
    });
    process.exit(0);
}


module.exports = list