PRINT 'Adding WorkflowProjectStatus - SPL Transfer within GRE'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    6 -- SPL
    , 20 -- Transferred within GRE
    , 1
    , 5
)
