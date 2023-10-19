const Joi = require('joi');

const blogSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
});

const blogUpdateSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().min(10).max(500),
    body: Joi.string().min(20).max(1000),
    tags: Joi.array().items(Joi.string().min(2).max(30)),
    state: Joi.string().valid('draft', 'published'),
    
}).or('title', 'description', 'body', 'tags', 'state');


const validBlogCreation = (req, res, next) => {
    const { error, value } = blogSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

const validBlogUpdate = (req, res, next) => {
    const { error, value } = blogUpdateSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

module.exports = { validBlogCreation, validBlogUpdate }
