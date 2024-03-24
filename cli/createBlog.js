const blogService = require('../services/blogService')
const chalk = require('chalk')

const add = async (options) => {
    try {
        const blogData = {
            title: options.title,
            description: options.desc,
            tags: options.tags,
            body: options.body,
            imageUrl: options.imageUrl || null,
        }

        const authorId = options.authorId || '653aabe17841516a8638de32'   // gotta find a way to go around this
        const dauthorId = options.authorId || 'Cli-Tester-Author Id';

        const result = await blogService.createBlog(authorId, blogData)
        const addedBlog = result.blog

        (chalk.green('Blog added successfully:'));
        (`---> Title: ${addedBlog.title}`);
        (`---> Description: ${addedBlog.description}`);
        (`---> Body: ${addedBlog.body}`);
        (`---> Tags: ${addedBlog.tags.join(', ')}`);
        (`---> Reading Time: ${addedBlog.reading_time}`);
        (`---> AuthorId: ${dauthorId}`);

        ()

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error adding the blog:'), error.message);

        process.exit(0);

    }
}


module.exports = add
