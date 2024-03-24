const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const emailService = require('./emailService')
const utils = require('./utils')
require('dotenv').config();

const logger = require('../logger/index')


// this is not really needed , it's justt here for the maintain time till signup service is seperated 
// from sending activation mail service
const addUser= async function (userData) {
    try {

        const existingEmail = await UserModel.findOne({ email: userData.email });
        const existingNumber = await UserModel.findOne({ phoneNumber: userData.phoneNumber });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        if (existingNumber) {
            return { status: 409, message: "Phone number already exists" };
        }
        const activationToken = jwt.sign({ email: userData.email, type: 'activation' }, process.env.SECRET_KEY, { expiresIn: '1d' })

        const newUser = await UserModel.create({
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
        });
        logger.info(`Account Created Succesfully for ${userData.email}`)

        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });


        return { status: 201, message: `success, an activation email has been sent to your mail`, token, data:newUser };
    } catch (error) {
        console.log(error);
        logger.error(`Error Occured wile signing up ${userData.email}, ${error}`)
        return { status: 500, message: error };
    }
}


const signup = async function (userData) {
    try {

        const existingEmail = await UserModel.findOne({ email: userData.email });
        const existingNumber = await UserModel.findOne({ phoneNumber: userData.phoneNumber });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }
        console.log(userData.phoneNumber)
        console.log({existingEmail})
        console.log({existingNumber})

        if (existingNumber) {
            return { status: 409, message: "Phone number already exists" };
        }
        const activationToken = jwt.sign({ email: userData.email, type: 'activation' }, process.env.SECRET_KEY, { expiresIn: '1d' })

        const newUser = await UserModel.create({
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
        });
        logger.info(`Account Created Succesfully for ${userData.email}`)

        logger.info(`Email Activation Process called for ${userData.email}`)
        emailService.sendActivationMail(userData.email, userData.firstname, activationToken)

        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });


        return { status: 201, message: `success, an activation email has been sent to your mail`, token };
    } catch (error) {
        console.log(error);
        logger.error(`Error Occured wile signing up ${userData.email}, ${error}`)
        return { status: 500, message: error };
    }
}


const resendActivationMail = async (email) => {
    try {
        const existingUser = await UserModel.findOne({ email: email });

        if (!existingUser) {
            return { status: 404, message: "User With Email doesn't exist on this server" };
        }

        if (existingUser.active) {
            return { status: 208, message: "Account Already Activated" };
        }

        const activationToken = jwt.sign({ email, type: 'activation' }, process.env.SECRET_KEY, { expiresIn: '1d' })

        emailService.sendActivationMail(email, existingUser.firstname, activationToken)
        logger.info(`Resend Activation process triggered for user: ${email}`)

        return { status: 200, message: `success, an activation email will be re-send to your email`, token };

    } catch (error) {
        console.log(error);
        logger.error(`Error Occured wile user: ${email} requested for resendEmail Activation`)
        return { status: 500, message: error };
    }
}


const activateAccount = async (token) => {

    try {
        const validToken = jwt.verify(token, process.env.SECRET_KEY);


        if (validToken.type !== 'activation') {
            return { status: 400, message: " Invalid Activation Code" }
        }

        const existingUser = await UserModel.findOneAndUpdate({ email: validToken.email }, { $set: { active: true } }, { new: true });


        if (!existingUser) {
            return { status: 404, message: "User With Email doesn't exist on this server" };
        }


        logger.info(`User: ${existingUser.email} activated their Account Succesfully`)
        return { status: 200, message: `Account activated succesfully` }


    } catch (error) {
        console.log(error);
        logger.error(`Error Occured while user try to activate account`)
        return { status: 500, message: error };
    }

}


const forgotPassword = async (email) => {
    try {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' })
        const existingUser = await UserModel.findOne({ email: email })

        logger.info(`user: ${email} requested for reset password mail`)

        if (!existingUser) {
            logger.warn(`user: ${email} requested for reset password mail but user doesnt exist`)
            return { status: 404, message: "User With Email doesn't exist on this server" };
        }

        logger.info(`sendForgotPasswordMail proccess triggered for user: ${email}`)

        emailService.sendForgotPasswordMail(existingUser.email, existingUser.firstname, token)

        return { status: 200, message: `Password reset message sent to your mail` }

    } catch (error) {
        console.log(error);
        logger.error(`Error Occured while user: ${email} requested for forgot password Email \n ${error}`)
        return { status: 500, message: error };
    }
}


const resetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;
        logger.info(`user: ${email} started reset password`)
        const existingUser = await UserModel.findOne({ email: email });


        existingUser.password = password
        await existingUser.save()  //triggers the pre save hook and hash the password

        logger.info(`user: ${email} reset password succesfully`)

        return { status: 200, message: `Password has been reset sucessfully!!` }

    } catch (error) {
        console.log(error)
        logger.error(`Error Occured while user: ${email} trying to reset their password. \n ${error}`)
        return { status: 500, message: `Invalid or expired reset token.` }
    }
}


const userService = { addUser,signup, resendActivationMail, activateAccount, forgotPassword, resetPassword }

module.exports = userService
