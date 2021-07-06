PRINT 'Adding ProjectStatusTransitions - Not in SPL -> In ERP'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES

-- Allow progression from Not in SPL -> In ERP
(
    5 -- ERP
    , 22 -- Not in SPL
    , 'In ERP'
    , 5 -- ERP
    , 30 -- In ERP
    , 0
)
