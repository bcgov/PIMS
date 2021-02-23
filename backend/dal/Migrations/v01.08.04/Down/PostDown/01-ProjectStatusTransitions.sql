PRINT 'Removing ProjectStatusTransitions'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 32 -- Disposed
