const router = require('express').Router();

const jiraEndpoint = require('./jira-api/index.js');
const realTimeEndpoint = require('./real-time/index.js')

router.use('/jira-api', jiraEndpoint);
router.use('/real-time', realTimeEndpoint);

module.exports = router