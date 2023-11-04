const request = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../models/user')

describe('Authentication Tests', () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    },15000)

    afterEach(async () => {
        await connection.cleanup()
    })

    // after hook
    afterAll(async () => {
        await connection.disconnect()
    })

    //Login-Test
    it('should successfully login a user', async () => {
        const user = {
            "email": "aoung@gmail.com",
            "firstname": "Usman",
            "lastname": "Abdulsalam",
            "password": "password",
            "phoneNumber": "080895XXXX"
        };

        await UserModel.create(user);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('message', 'Success');
        expect(response.body).toHaveProperty('token');

    }, 30000);

    // my mongodb-memory-sever isnot working for some reason.I am unable to fix it for now.
    // 

});
