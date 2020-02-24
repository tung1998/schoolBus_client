Parrent_feedback{
    ID: int,
    userID: int,
    title: text,
    type: [1,2,3,4] (
        1: Report
        2: Bug
        3: Contribute
        4: Else
    ),
    Content: text,
    createdTime: timestamp,
    status: int,
    responseBy: int
    responseTime: timestamp,
    response: int
}

