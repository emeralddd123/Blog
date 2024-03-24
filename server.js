require('dotenv').config()
const port = process.env.PORT || 3000;
const app = require('./app')

const connnectToDb = require('./dbConnection')

connnectToDb()


app.listen(port, () => {
    (`Server is running on port ${port}`);
});