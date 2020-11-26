PRINT 'Removing WorkflowProjectStatus'

DELETE FROM dbo.[WorkflowProjectStatus]
WHERE [WorkflowId] = 6
    AND [StatusId] = 43 -- Contract in Place - Unconditional
