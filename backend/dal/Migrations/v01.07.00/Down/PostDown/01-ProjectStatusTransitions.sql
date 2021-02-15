PRINT 'Delete ProjectStatusTransitions - SPL to Transfer within GRE'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 20
