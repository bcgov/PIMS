PRINT 'Adding WorkflowProjectStatus'

INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
) VALUES (
    6 -- SPL
    , 43 -- Contract in Place - Unconditional
    , 0
    , 5
)

-- Reorder the subsequent project status.
UPDATE dbo.[WorkflowProjectStatus]
SET
 [SortOrder] = 6
WHERE [WorkflowId] = 6
    AND [StatusId] = 32 -- Disposed

UPDATE dbo.[WorkflowProjectStatus]
SET
 [SortOrder] = 7
WHERE [WorkflowId] = 6
    AND [StatusId] = 23 -- Cancelled
