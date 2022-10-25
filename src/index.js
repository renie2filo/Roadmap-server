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
    extended: false
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

    const response = await axios.get('https://filocode.atlassian.net/rest/api/3/issue/FZ-419', {
        auth: {
            username: "renie@filotrack.com",
            password: "dnBr95az278MzGxIOc8j7D7A"
        }
    })
    console.log(response)
    res.send(await response.data)

})

// app.listen(app.get('PORT'), () =>
//     console.log('Listening at ' + app.get('PORT')))

app.listen(PORT, () => {
    console.log('Listening at http://localhost:' + PORT)
})