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

//* SIMULATE JIRA API
router.get('/', async (req, res, next) => {
    try {

        const {
            query
        } = req.query

        const response = await axios.get(`${process.env.JIRA_API_URL}/${query}`, {
            ...basicAuth
        })

        const result = await response.data

        res.send(result)

    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.get('/:issue_id', async (req, res, next) => {
    try {
        const {
            issue_id
        } = req.params

        const response = await axios.get(`${process.env.JIRA_API_URL}${issue}/${issue_id}?fields=key,created,status,assignee,summary,issuetype,priority,creator,progress,updated,duedate,resolutiondate`, {
            ...basicAuth
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

router.get('/jira-software/sprint/:id', async (req, res, next) => {
    try {

        const {
            id
        } = req.params

        const response = await axios.get(`${process.env.JIRA_API_SOFTWARE_URL}/sprint/${id}`, {
            ...basicAuth
        })

        const result = await response.data

        res.send(result)

    } catch (error) {
        console.log(error)
        next(error)
    }
})
router.get('/jira-software/sprint/:id/issue', async (req, res, next) => {
    try {

        const {
            id
        } = req.params

        const handlerPostJira = async (startAt) => {
            const response = await axios.get(`${process.env.JIRA_API_SOFTWARE_URL}/sprint/${id}/issue?maxResults=100&startAt=${startAt}`, {
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
                // return getIssueDataFromArray(result["issues"])
                return result["issues"].map(issue => {
                    return {
                        "key": issue["key"],
                        "time_tracking": issue["fields"]["timetracking"]
                    }
                })
            })
        } else {
            issues_data = issues.map(issue => {
                return {
                    "key": issue["key"],
                    "time_tracking": issue["fields"]["timetracking"]
                }
            })
        }

        // //* GET ONLY KEY ISSUES AND TIMETRACKING
        // issues_data = issues_data.map(issue => {return{ "key": issue["key"], "time_tracking": issue["timeTracking"]}})

        const final_result = {
            "total": total,
            "issues_data": issues_data,
            "total_fetched": issues_data.length
        }

        res.send(final_result)

    } catch (error) {
        console.log(error)
        next(error)
    }
})

module.exports = router