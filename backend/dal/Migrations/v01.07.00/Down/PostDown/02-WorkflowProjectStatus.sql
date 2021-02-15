PRINT 'Delete WorkflowProjectStatus - SPL Transfer within GRE'

DELETE FROM dbo.[WorkflowProjectStatus]
WHERE [WorkflowId] = 6 -- SPL
    AND [StatusId] = 20 -- Transferred within GRE
