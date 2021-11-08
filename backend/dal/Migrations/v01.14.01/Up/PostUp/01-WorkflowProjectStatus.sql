PRINT 'Adding WorkflowProjectStatus - SPL -> On Hold'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    6 -- SPL
    , 31 -- On Hold
    , 1
    , 5
)
