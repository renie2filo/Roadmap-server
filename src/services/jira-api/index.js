const router = require('express').Router();
const axios = require('axios');

//* JIRA ENDPOINTS
const endpoints = {
    "issue": "/issue",
    "jql": "/search"
}

const {
    issue,
    jql
} = endpoints;

//* JIRA AUTH
const basicAuth = {
    "auth": {
        "username": process.env.JIRA_API_USERNAME,
        "password": process.env.JIRA_API_TOKEN
    }
}

router.get('/:issue_id', async (req, res, next) => {
    try {
        const {
            issue_id
        } = req.params

        const response = await axios.get(`${process.env.JIRA_API_URL}${issue}/${issue_id}`, {
            ...basicAuth
        })

        //? console.log("/jira-api/index.js line 26", response)

        const result = await response.data

        //? console.log("/jira-api/index.js line 30", result)

        res.send(result)

    } catch (error) {
        console.log(error);
        next(error);
    }

})

router.post('/get-filter', async (req, res, next) => {
    try {
        const {
            body
        } = req

        const response = await axios.post(`${process.env.JIRA_API_URL}${jql}`, body, {
            ...basicAuth
        });

        //? console.log("/jira-api/index.js line 47", response)

        const result = await response.data

        //? console.log("/jira-api/index.js line 51", result)

        res.send(result)

    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router