PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES
-- Allow progression from Approved for ERP to Cancelled
(
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Cancel Project'
    , 5 -- ERP
    , 23 -- Cancelled
    , 0
)

-- Allow progression from Not in SPL to Cancelled
, (
    5 -- ERP
    , 22 -- Not in SPL
    , 'Cancel Project'
    , 5 -- ERP
    , 23 -- Cancelled
    , 0
)

-- Allow progression from Approved for SPL to Cancelled
, (
    6 -- SPL
    , 21 -- Approved for SPL
    , 'Cancel Project'
    , 6 -- SPL
    , 23 -- Cancelled
    , 0
)
