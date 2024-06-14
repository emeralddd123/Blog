const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 3000;
const path = require('path');


const app = express();

const thirdPartyCors = process.env.THIRD_PARTY_CORS.split(' ');

let corsOptions = { origin: [...thirdPartyCors, 'http://localhost:3000'] }

console.log(corsOptions)

app.use(cors())


const webRouter = require('./web/webRoutes');
const apiRouter = require('./api/apiRoutes');

app.use(morgan('common'));

app.use(express.json()) // body parser: json
app.use(express.urlencoded({ extended: true })); // body prser: formdata

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/api', apiRouter);
app.use('/', webRouter)

app.get('*', async (req, res) => {
    let message
    res.status(404).render('404')
})



module.exports = app