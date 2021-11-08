PRINT 'Delete WorkflowProjectStatus - SPL --> On Hold'

DELETE FROM dbo.[WorkflowProjectStatus]
WHERE [WorkflowId] = 6 -- SPL
    AND [StatusId] = 31 -- On Hold
