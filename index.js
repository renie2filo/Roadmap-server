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
} = require('./src/errors/index.js')

const main_router = require('./src/services/index.js')

require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5001
const whiteList = process.env.NODE_ENV === 'production' ? [process.env.FE_PROD_URL, process.env.FE_DEV_URL] : [process.env.FE_DEV_URL]
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("CORS ISSUES : Invalid origin - Check origins list"))
        }
    }
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', async (req, res, next) => {
    try {
        res.send(process.env.JIRA_API_TOKEN)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

app.get('/:issue_id', async (req, res, next) => {
    try {
        const {
            issue_id
        } = req.params

        const response = await axios.get(`${process.env.JIRA_API_URL}/issue/${issue_id}?fields=key,created,status,assignee,summary,issuetype,priority,creator,progress,updated,duedate,resolutiondate`, {
            "auth": {
                "username": process.env.JIRA_API_USERNAME,
                "password": process.env.JIRA_API_TOKEN
            }
        })

        //? console.log("/jira-api/index.js line 26", response)

        const result = await response.data

        const issue_result = getIssueData(result)

        //? console.log("/jira-api/index.js line 30", result)

        res.send(issue_result)

    } catch (error) {
        console.log(error);
        next(error);
    }
})

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

module.exports = app