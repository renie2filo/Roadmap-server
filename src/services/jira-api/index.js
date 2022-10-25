const router = require('express').Router();
const axios = require('axios');

//* UTILITIES
const {
    getIssueData,
    getIssueDataFromArray,
    postJiraAdditionalBody,
    sequentialFetch
} = require('./utilities.js')

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

        const response = await axios.get(`${process.env.JIRA_API_URL}${issue}/${issue_id}?fields=key,created,status,assignee,summary,issuetype,priority,creator,progress,updated`, {
            ...basicAuth
        })

        //? console.log("/jira-api/index.js line 26", response)

        const result = await response.data

        const issue = getIssueData(result)

        //? console.log("/jira-api/index.js line 30", result)

        res.send(issue)

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

        //* FUNCTION TO POST JIRA
        const handlerPostJira = async (startAt) => {
            const response = await axios.post(`${process.env.JIRA_API_URL}${jql}`, {
                ...body,
                ...postJiraAdditionalBody(startAt)
            }, {
                ...basicAuth
            });

            const result = await response.data

            return result

        }

        //* FIRST FETCH
        const {
            total,
            issues
        } = await handlerPostJira(0)

        let issues_data = []

        if (total > 100) {
            issues_data = await sequentialFetch(total, async (startAt) => {
                const result = await handlerPostJira(startAt)
                return getIssueDataFromArray(result["issues"])
            })
        } else issues_data = [...getIssueDataFromArray(issues)]

        const final_result = {
            "total": total,
            "issues_data": issues_data,
            "total_fetched": issues_data.length
        }

        //? console.log("/jira-api/index.js line 51", result)

        res.send(final_result)

    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router