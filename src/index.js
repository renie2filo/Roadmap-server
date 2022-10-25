const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const listEndpoints = require("express-list-endpoints")
const axios = require('axios');

const {
    notFound,
    unAuthorized,
    forbidden,
    badRequest,
    generalError
} = require('./errors/index.js')

const main_router = require('./services/index.js')

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001
const whiteList = process.env.NODE_ENV === 'production' ? [process.env.PROD_URL, process.env.DEV_URL] : [process.env.DEV_URL]
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("CORS ISSUES : Invalid origin - Check origins list"))
        }
    }
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', main_router)

//! ERRORS
app.use(notFound)
app.use(unAuthorized)
app.use(forbidden)
app.use(badRequest)
app.use(generalError)

console.log(listEndpoints(app))

app.listen(PORT, () => {
    console.log('Listening at http://localhost:' + PORT)
})