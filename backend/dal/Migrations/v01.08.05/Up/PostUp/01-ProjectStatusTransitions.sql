PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES
-- Allow progression from Not in SPL to Transfer within GRE
(
    5 -- ERP
    , 22 -- Not in SPL
    , 'Transfer within GRE'
    , 5 -- ERP
    , 20 -- Transferred within GRE
    , 0
)
