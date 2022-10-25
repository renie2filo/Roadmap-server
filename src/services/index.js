const router = require('express').Router();

const jiraEndpoint = require('./jira-api/index.js');

router.use('/jira-api', jiraEndpoint);

module.exports = router