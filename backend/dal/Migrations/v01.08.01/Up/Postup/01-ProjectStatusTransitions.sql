PRINT 'Adding ProjectStatusTransitions'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES
-- Allow progression from Not in SPL to Cancelled
(
    4 -- ASSESS-EX-DISPOSAL
    , 22 -- Not in SPL
    , 'Cancel Project'
    , 4 -- ASSESS-EX-DISPOSAL
    , 23 -- Cancelled
    , 0
),
-- Allow progression from Not in SPL to Transfer within GRE
(
    4 -- ASSESS-EX-DISPOSAL
    , 22 -- Not in SPL
    , 'Transfer within GRE'
    , 4 -- ASSESS-EX-DISPOSAL
    , 20 -- Transferred within GRE
    , 0
),
-- Allow progression from Not in SPL to Approved for SPL
(
    4 -- 'ASSESS-EX-DISPOSAL'
    , 22 -- Not in SPL
    , 'Proceed to SPL'
    , 6 -- SPL
    , 21 -- Approved for SPL
    , 0
),
-- Allow progression from Not in SPL to Approved for ERP
(
    4 -- 'ASSESS-EX-DISPOSAL'
    , 22 -- Not in SPL
    , 'Proceed to ERP'
    , 5 -- ERP
    , 14 -- Approved for ERP
    , 0
)

