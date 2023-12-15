#! /usr/bin/env node

const { program } = require('commander')
const connectToDb = require('./dbConnection')

const addUser = require('./cli/createUser')

const getBlogs = require('./cli/getBlogs')
const createBlog = require('./cli/createBlog')


connectToDb()

program
    .command('list')
    .description('List all the Blogs')
    .action(getBlogs)

program
    .command('add-blog')
    .description('Add A new BlogPost')
    .requiredOption('-t, --title <title>', 'Blog title')
    .requiredOption('-d, --desc <desc>', 'Blog description')
    .requiredOption('-b, --body <body>', 'Blog Content')
    .option('-tags, --tags <tags...>', 'List of tags', [])
    .option('-i, --imageUrl <imageUrl>', 'Image URL for the header')
    .action(createBlog)

program
    .command('add-user')
    .description('Add a new user')
    .requiredOption('-f, --firstname <firstname>', 'User first name')
    .requiredOption('-l, --lastname <lastname>', 'User last name')
    .requiredOption('-p, --phoneNumber <phoneNumber>', 'User phone number')
    .requiredOption('-e, --email <email>', 'User email')
    .requiredOption('-w, --password <password>', 'User password')
    .action(addUser)


program.parse()
