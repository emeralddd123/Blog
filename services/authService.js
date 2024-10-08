const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const logger = require('../logger/index')

const login = async function (loginData) {

    try {

        const userWithEmail = await UserModel.findOne({ email: loginData.email });

        if (!userWithEmail) {
            logger.info(`Incorrect login credentials from ${loginData.email}`)
            return { status: 401, message: "Incorrect login credentials" };
        }
        // (userWithEmail)
        const isValidPassword = await userWithEmail.isValidPassword(loginData.password);

        if (!isValidPassword) {
            logger.info(`Incorrect login credentials from ${loginData.email} due to incorrect password`)
            return { status: 401, message: "Incorrect login credentials" };
        } else {
            const userData = { ...userWithEmail._doc };
            delete userData['password'];
            delete userData['activationToken'];
            delete userData['updatedAt'];

            const token = jwt.sign({ user: userData }, process.env.SECRET_KEY, { expiresIn: '24h' });

            logger.info(`${loginData.email} login succesfully!! `)
            return { status: 201, message: 'Success', token };
        }
    } catch (error) {
        console.error(error);
        logger.error(`Error Occured while user ${loginData.email} try to login.  \n ${error}`)
        return { status: 500, message: 'Internal server error' };
    }
}

const authService = { login }

module.exports = authService;
