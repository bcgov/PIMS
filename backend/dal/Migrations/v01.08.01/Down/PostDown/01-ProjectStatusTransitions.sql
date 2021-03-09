PRINT 'Removing ProjectStatusTransitions'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 4 -- ASSESS-EX-DISPOSAL
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 4 -- ASSESS-EX-DISPOSAL
    AND [ToStatusId] = 23 -- Cancelled

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 4 -- ASSESS-EX-DISPOSAL
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 4 -- ASSESS-EX-DISPOSAL
    AND [ToStatusId] = 20 -- Transferred within GRE

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 4 -- 'ASSESS-EX-DISPOSAL'
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 21 -- Approved for SPL

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 4 -- 'ASSESS-EX-DISPOSAL'
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 14 -- Approved for ERP
