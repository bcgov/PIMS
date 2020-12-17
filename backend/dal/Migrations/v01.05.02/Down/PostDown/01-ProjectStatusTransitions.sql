PRINT 'Removing ProjectStatusTransitions'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 14 -- Approved for ERP
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 23 -- Cancelled

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 23 -- Cancelled

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 21 -- Approved for SPL
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 23 -- Cancelled
