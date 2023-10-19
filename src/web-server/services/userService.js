const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const signup = async function (userData) {
    try {

        const existingEmail = await UserModel.findOne({ email: userData.email });
        const existingUsername = await UserModel.findOne({ username: userData.username });
        const existingNumber = await UserModel.findOne({ phoneNumber: userData.phoneNumber });

        if (existingEmail) {
            return { status: 409, message: "Email already exists" };
        }

        if (existingUsername) {
            return { status: 409, message: "Username already exists" };
        }

        if (existingNumber) {
            return { status: 409, message: "Phone number already exists" };
        }

        const newUser = await UserModel.create({
            email: userData.email,
            username: userData.username,
            phoneNumber: userData.phoneNumber,
            password: userData.password,
        });

        delete newUser.password;

        const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        return { status: 201, message: 'success', token };
    } catch (error) {
        console.log(error);
        return { status: 500, message: error };
    }
}

const userService = { signup }

module.exports = userService
