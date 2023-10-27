const jwt = require('jsonwebtoken')
require('dotenv').config()


const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken.user
    } catch (error) {
        return res.redirect('login')
    }

    next()
}



const isActivated = (req, res, next) => {
    try {
        if (req.user.active !== true) {
            return res.redirect('').json({ message: "Please Activate your account to perform ths action" })
        }
    } catch (error) {
        return res.json(error)
    }

    next()
}

module.exports = authenticate