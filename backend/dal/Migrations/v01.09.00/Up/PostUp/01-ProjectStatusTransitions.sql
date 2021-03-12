PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES
-- Allow progression from Approved for ERP to Not in SPL
(
    5 -- ERP
    , 14 -- Approved for ERP
    , 'Proceed to Not in SPL'
    , 5 -- ERP
    , 22 -- Not in SPL
    , 0
)

