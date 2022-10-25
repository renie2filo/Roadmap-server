const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const listEndpoints = require("express-list-endpoints")
const Pusher = require('pusher');
const axios = require('axios');

const {
    notFound,
    unAuthorized,
    forbidden,
    badRequest,
    generalError
} = require('./utilities/errors/index.js')

const main_router = require('./services/index.js')

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001
// const whiteList = process.env.NODE_ENV === 'production' ? [process.env.PROD_URL, process.env.DEV_URL] : [process.env.DEV_URL]
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whiteList.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error("CORS ISSUES : Invalid origin - Check origins list"))
//         }
//     }
// }

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// const pusher = new Pusher({
//     "appId": process.env.PUSHER_APP_ID,
//     "key": process.env.PUSHER_KEY,
//     "secret": process.env.PUSHER_SECRET,
//     "cluster": process.env.PUSHER_CLUSTER,
//     "encrypted": true
// })

// app.set('PORT', process.env.SERVER_PORT_OFFLINE || 5001);

// app.post('/message', (req, res) => {
//     const payload = req.body;
//     pusher.trigger('chat', 'message', payload);
//     res.send(payload)
// });

app.use('/', main_router)

//! ERRORS
app.use(notFound)
app.use(unAuthorized)
app.use(forbidden)
app.use(badRequest)
app.use(generalError)

// app.listen(app.get('PORT'), () =>
//     console.log('Listening at ' + app.get('PORT')))

console.log(listEndpoints(app))

app.listen(PORT, () => {
    console.log('Listening at http://localhost:' + PORT)
})