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

        console.log(chalk.yellow('Adding user with the following details:'));
        console.log(chalk.green('First Name:'), userData.firstname);
        console.log(chalk.green('Last Name:'), userData.lastname);
        console.log(chalk.green('Phone Number:'), userData.phoneNumber);
        console.log(chalk.green('Email:'), userData.email);

        const result = await userService.addUser(userData);
        console.log(result)
        const newUserData = result.data
        console.log(chalk.green('User added successfully:'));
        console.log(chalk.green('---> ID:'), newUserData._id);
        console.log(chalk.green('---> First Name:'), newUserData.firstname);
        console.log(chalk.green('---> Last Name:'), newUserData.lastname);
        console.log(chalk.green('---> Email:'), newUserData.email);
        console.log(chalk.green('---> Role:'), newUserData.role);
        console.log(chalk.green('---> Active:'), newUserData.active);
        console.log(chalk.green('---> Access Token:'), result.token);
        console.log()

        process.exit(0);
    } catch (error) {
        console.error(chalk.red('Error Adding User:'), error.message);
        console.log()

        process.exit(0);
    }
};

module.exports = addUser
