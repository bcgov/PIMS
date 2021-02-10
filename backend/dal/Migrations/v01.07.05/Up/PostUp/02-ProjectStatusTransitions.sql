PRINT 'Adding ProjectStatusTransitions - SPL to Transfer within GRE'

INSERT INTO dbo.[ProjectStatusTransitions] (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES

-- Allow progression from all SPL status to Transfer within GRE
(
    6 -- SPL
    , 21 -- Approved for SPL
    , 'Transfer within GRE'
    , 6 -- SPL
    , 20 -- Transferred within GRE
    , 0
), (
    6 -- SPL
    , 40 -- Pre-Marketing
    , 'Transfer within GRE'
    , 6 -- SPL
    , 20 -- Transferred within GRE
    , 0
), (
    6 -- SPL
    , 41 -- Marketing
    , 'Transfer within GRE'
    , 6 -- SPL
    , 20 -- Transferred within GRE
    , 1
), (
    6 -- SPL
    , 42 -- Contract in Place - Conditional
    , 'Transfer within GRE'
    , 6 -- SPL
    , 20 -- Transferred within GRE
    , 0
), (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 'Transfer within GRE'
    , 6 -- SPL
    , 20 -- Transferred within GRE
    , 1
)
