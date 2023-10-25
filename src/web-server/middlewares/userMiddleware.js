const Joi = require("joi");

const userCreateSchema = Joi.object({
	email: Joi.string().min(3).max(255).required(),
	firstname: Joi.string().min(3).max(100).required(),
    lastname: Joi.string().min(3).max(100).required(),
	password: Joi.string().min(3).required(),
	phoneNumber: Joi.string().min(3).required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(3).required()
})

const activationSchema = Joi.object({
    email: Joi.string().min(3).max(255).required(),
    token: Joi.string().min(3).required()
})

const validUserCreation = (req, res, next) => {
    const { error, value } = userCreateSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

const validLoginCreation = (req, res, next) => {
    const { error, value } = userLoginSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

const validUserActivation = (req, res, next) => {
    const { error, value } = activationSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

module.exports = { validUserCreation, validLoginCreation, validUserActivation }
