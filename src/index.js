const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


const app = express();
const PORT = process.env.SERVER_PORT_OFFLINE || 5001

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

app.get('/jira-api', async (req, res) => {

    try {
        const response = await axios.get('https://filocode.atlassian.net/rest/api/3/issue/FZ-419', {
            auth: {
                username: process.env.JIRA_API_USERNAME,
                password: process.env.JIRA_API_TOKEN
            }
        })
        const result = await response.data
        console.log(result)
        res.send(result)

    } catch (error) {
        console.log(error)
    }

})

// app.listen(app.get('PORT'), () =>
//     console.log('Listening at ' + app.get('PORT')))

app.listen(PORT, () => {
    console.log('Listening at http://localhost:' + PORT)
})