const postJiraAdditionalBody = (startAt) => {
    return {
        "maxResults": 100,
        "startAt": startAt > 0 ? startAt : 0,
        "fields": [
            "key",
            "summary",
            "issuetype",
            "priority",
            "assignee",
            "status",
            "creator",
            "progress",
            "updated",
            "created",
            "duedate",
            "resolutiondate",
            "customfield_10017"
        ]
    }
}

const sequentialFetch = async (total, cb) => {

    let times = parseInt(total / 100);
    const reminder = total % 100;

    reminder > 0 ? times += 1 : times

    let result = []

    for (let i = 0; i < times; i++) {
        const startAt = i * 100;
        const issues = await cb(startAt)

        result = result.concat(issues)
    }

    return result

}

const getIssueData = (issue) => {
    const {
        key,
        fields
    } = issue
    const {
        summary,
        issuetype,
        priority,
        assignee,
        status,
        creator,
        progress,
        updated,
        created,
        duedate,
        resolutiondate,
        customfield_10017
    } = fields
    return {
        key,
        "summary": summary,
        "url": `${process.env.JIRA_FILO_URL}/browse/${key}`,
        "issue_type": issuetype["name"],
        "priority": priority["name"],
        "assignee": assignee ? {
            "name": assignee["displayName"],
            "avatar": assignee["avatarUrls"]["32x32"]
        } : null,
        "status": status["name"],
        "creator": creator ? {
            "name": creator["displayName"],
            "avatar": creator["avatarUrls"]["32x32"]
        } : null,
        "created_at": created.substring(0, 10),
        "last_update": updated.substring(0, 10),
        "resolution_date": resolutiondate ? resolutiondate.substring(0, 10) : null,
        "duedate": duedate ? duedate : null,
        "progress": {
            "progress": progress["progress"] === 0 ? 0 : progress["progress"] / 3600,
            "total": progress["total"] === 0 ? 0 : progress["total"] / 3600,
            "percent": progress["percent"] === 0 ? 0 : progress["percent"] * 100 / progress["progress"]
        },
        "label_color": customfield_10017 ? customfield_10017 : null
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
    getIssueDataFromArray,
    postJiraAdditionalBody,
    sequentialFetch
}