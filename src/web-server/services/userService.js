const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const emailService = require('./emailService')
const utils = require('./utils')
require('dotenv').config();



const signup = async function (userData) {
    try {

        const existingEmail = await UserModel.findOne({ email: userData.email });
        const existingNumber = await UserModel.findOne({ phoneNumber: userData.phoneNumber });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        if (existingNumber) {
            return { status: 409, message: "Phone number already exists" };
        }
        const activationToken = utils.generateToken()

        const newUser = await UserModel.create({
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
            activationToken: activationToken
        });

        emailService.sendActivationMail(userData.email, userData.firstname, activationToken)

        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });


        return { status: 201, message: `success, an activation email has been sent to your mail`, token };
    } catch (error) {
        console.log(error);
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

        const activationToken = utils.generateToken()

        existingUser.activationToken = activationToken
        await existingUser.save()

        emailService.sendActivationMail(email, existingUser.firstname, activationToken)

        return { status: 200, message: `success, an activation email will be re-send to your email`, token };

    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }
}


const activateAccount = async (email, token) => {

    try {
        const existingUser = await UserModel.findOne({ email: email });

        if (!existingUser) {
            return { status: 404, message: "User With Email doesn't exist on this server" };
        }

        if (existingUser.active) {
            return { status: 208, message: "Account Already Activated" };
        }

        if (existingUser.activationToken !== token) {
            return { status: 400, message: " Invalid Activation Code" }
        } else {
            existingUser.active = true
            await existingUser.save()
            return { status: 200, message: `Account activated succesfully` }
        }


    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }

}


const forgotPassword = async (email) => {
    try {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' })
        const existingUser = await UserModel.findOne({ email: email });

        if (!existingUser) {
            return { status: 404, message: "User With Email doesn't exist on this server" };
        }

        emailService.sendForgotPasswordMail(existingUser.email, existingUser.firstname, token)

        return { status: 200, message: `Password reset message sent to your mail` }

    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }
}


const resetPassword = async (token, password) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const email = decoded.email;

        const existingUser = await UserModel.findOne({ email: email });


        existingUser.password = password
        await existingUser.save()  //triggers the pre save hooks and hash the password

        return { status: 200, message: `Password has been reset sucessfully!!` }

    } catch (error) {
        console.log(error)
        return { status: 500, message: `Invalid or expired reset token.` }
    }
}


const userService = { signup, resendActivationMail, activateAccount, forgotPassword, resetPassword }

module.exports = userService
