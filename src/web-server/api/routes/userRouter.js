const express = require('express');
const userRouter = express.Router();
const userService = require('../../services/userService');
const { validUserCreation, validUserActivation } = require('../../middlewares/userMiddleware');
const { token } = require('morgan');


userRouter.post('/signup', validUserCreation, async (req, res) => {
    try {
        const userData = req.body
        const result = await userService.signup(userData);

        if (result.status === 201) {
            res.status(result.status).json({ message: result.message, value: result.token });
        } else if (result.status === 400) {
            res.status(result.status).json({ error: result.message });
        }
        else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


userRouter.post('/activate', async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ error: `token is required` })
        }
        const result = await userService.activateAccount(token)

        if (result.status === 200) {
            res.status(result.status).json({ message: result.message });
        } else {
            res.status(result.status).json({ error: result.message });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

userRouter.post('/resend-activation', async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ error: `Email is required` })
        }

        const result = await userService.resendActivationMail(email)

        if (result.status === 200) {
            res.status(result.status).json({ message: result.message });
        } else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


userRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ error: `Email is required` })
        }

        const result = await userService.forgotPassword(email)

        if (result.status === 200) {
            res.status(result.status).json({ message: result.message });
        } else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


userRouter.post('/reset-password', async (req, res) => {
    try {
        if (!req.body.newPassword || !req.body.token) {
            return res.status(400).json({ error: `Email and Token is required` });
        }
        const { token, newPassword } = req.body

        const result = await userService.resetPassword(token, newPassword)
        if (result.status === 200) {
            res.status(result.status).json({ message: result.message });
        } else {
            res.status(result.status).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = userRouter;
