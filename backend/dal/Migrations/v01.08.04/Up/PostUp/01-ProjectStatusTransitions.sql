PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES
-- Allow progression from Not in SPL to Disposed
(
    5 -- ERP
    , 22 -- Not in SPL
    , 'Dispose Project'
    , 5 -- ERP
    , 32 -- Disposed
    , 0
)
