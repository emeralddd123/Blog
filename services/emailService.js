const nodemailer = require('nodemailer')
require('dotenv').config()

const logger = require('../logger/index')

const websiteURL = process.env.WEBSITE_URL || 'http://localhost:3000'

const config = {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE || false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}


const sendMail = async (data) => {
    const transporter = nodemailer.createTransport(config)
    transporter.sendMail(data, (err, info) => {
        if (err) {
            console.log(`Error sending mail to ${data.to}`)
            logger.error(`Error Sending ${data.subject} to ${data.to}, \n ${err}`)
            console.log(err)
        } else {
            logger.info(`Email ${data.subject} sent succesfully to ${data.to}`)
            console.log(info.response)
        }
    })
}


const generateActivationUrl = async (activationToken) => {
    return `${websiteURL}/activate-account?token=${activationToken}`
}


const sendActivationMail = async (email, firstname, activationToken) => {
    
    const activationUrl = await generateActivationUrl(activationToken)

    const data = {
        'from': config.auth.user,
        'to': email,
        'subject': `Email Activation Message. You signed Up at UpBlog`,
        'text': `
        Dear ${firstname},

        Welcome to UpBlog, We're excited to have you as a part of our community. To get started, please activate your account by clicking the activation link below:

        ${activationUrl}

        If you didn't request this activation, please ignore this message. Your account won't be activated until you click the link above.

        Thank you for choosing Upblog. We look forward to providing you with a great experience.

        Best regards,
        The Upblog Team
    `
    }

    sendMail(data)
}


const sendForgotPasswordMail = async (email, firstname, token) => {
    const url = `${websiteURL}/reset-password/${token}`

    const data = {
        'from': config.auth.user,
        'to': email,
        'subject': 'Password Reset Request',
        'text': ` Hi ${firstname},

        You've requested a password reset for your account. To reset your password, please visit the following link:

        Reset Your Password: ${url}

        If you didn't request a password reset, you can ignore this email.

        Best regards,
        The UpBlog Team
        `
    }

    sendMail(data)
}



const emailService = {
    sendMail,
    sendActivationMail,
    sendForgotPasswordMail
}

module.exports = emailService
