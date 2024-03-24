const userService = require('../services/userService');
const chalk = require('chalk');

const addUser = async (options) => {
    try {
        const userData = {
            firstname: options.firstname,
            lastname: options.lastname,
            phoneNumber: options.phoneNumber,
            email: options.email,
            password: options.password,
            role: 'user',
            active: true,
        };

        (chalk.yellow('Adding user with the following details:'));
        (chalk.green('First Name:'), userData.firstname);
        (chalk.green('Last Name:'), userData.lastname);
        (chalk.green('Phone Number:'), userData.phoneNumber);
        (chalk.green('Email:'), userData.email);

        const result = await userService.addUser(userData);
        (result)
        const newUserData = result.data
        (chalk.green('User added successfully:'));
        (chalk.green('---> ID:'), newUserData._id);
        (chalk.green('---> First Name:'), newUserData.firstname);
        (chalk.green('---> Last Name:'), newUserData.lastname);
        (chalk.green('---> Email:'), newUserData.email);
        (chalk.green('---> Role:'), newUserData.role);
        (chalk.green('---> Active:'), newUserData.active);
        (chalk.green('---> Access Token:'), result.token);
        ()

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error Adding User:'), error.message);
        ()

        process.exit(0);
    }
};

module.exports = addUser
