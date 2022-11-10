const router = require('express').Router();

const jiraEndpoint = require('./jira-api/index.js');
const realTimeEndpoint = require('./real-time/index.js')
const otherEndpoint = require('./other/index.js')

router.use('/jira-api', jiraEndpoint);
router.use('/real-time', realTimeEndpoint);
router.use('/utilitie', otherEndpoint);

module.exports = router