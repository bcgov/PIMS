PRINT 'Removing ProjectStatusTransitions'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 40 -- Pre-Marketing
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 42 -- Contract in Place - Conditional

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 40 -- Pre-Marketing
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 43 -- Contract in Place - Unconditional

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 42 -- Contract in Place - Conditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 41 -- Marketing

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 42 -- Contract in Place - Conditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 43 -- Contract in Place - Unconditional

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 41 -- Marketing
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 43 -- Contract in Place - Unconditional

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 43 -- Contract in Place - Unconditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 32 -- Disposed

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 43 -- Contract in Place - Unconditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 41 -- Marketing

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 43 -- Contract in Place - Unconditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 40 -- Pre-Marketing

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 43 -- Contract in Place - Unconditional
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 23 -- Cancelled

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
    AND [FromStatusId] = 40 -- Pre-Marketing
    AND [ToWorkflowId] = 5 -- ERP
    AND [ToStatusId] = 22 -- Not in SPL

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 22 -- Not in SPL
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 21 -- Approved for SPL

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 5 -- ERP
    AND [FromStatusId] = 14 -- Approved for ERP
    AND [ToWorkflowId] = 6 -- SPL
    AND [ToStatusId] = 21 -- Approved for SPL

UPDATE dbo.[ProjectStatusTransitions]
SET
    [Action] = 'Contract in Place'
WHERE
    [FromWorkflowId] = 6
    AND [FromStatusId] = 41
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 42
