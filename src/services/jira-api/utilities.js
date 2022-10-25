const getIssueData = (issue) => {
    const {
        key,
        fields
    } = issue
    const {
        issuetype,
        priority,
        assignee,
        status,
        creator,
        progress,
        updated
    } = fields
    return {
        key,
        "url": `${process.env.JIRA_FILO_URL}/browse/${key}`,
        "issue_type": issuetype["name"],
        "priority": priority["name"],
        "assignee": {
            "name": assignee["displayName"],
            "avatar": assignee["avatarUrls"]["32x32"]
        },
        "status": status["name"],
        "creator": {
            "name": creator["displayName"],
            "avatar": creator["avatarUrls"]["32x32"]
        },
        "last_update": updated.substring(0, 16),
        "progress": {
            "progress": progress["progress"] === 0 ? 0 : progress["progress"] / 3600,
            "total": progress["total"] === 0 ? 0 : progress["total"] / 3600,
            "percent": progress["percent"] === 0 ? 0 : progress["percent"] * 100 / progress["progress"]
        }
    }
}

const getIssueDataFromArray = (array_issues) => {
    const issues_field = array_issues.map(issue => {
        return getIssueData(issue);
    })
    return issues_field
}

module.exports = {
    getIssueData,
    getIssueDataFromArray
}