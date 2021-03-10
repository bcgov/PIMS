PRINT 'Removing ProjectStatusTransitions'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 14 -- Approved for ERP
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 22 -- Not in SPL
