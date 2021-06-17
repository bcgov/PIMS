PRINT 'Adding ProjectStatusTransitions'

MERGE INTO dbo.[ProjectStatusTransitions] dest
USING ( VALUES
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
) AS src (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
)
ON dest.[FromWorkflowId] = src.[FromWorkflowId]
    AND dest.[FromStatusId] = src.[FromStatusId]
    AND dest.[ToWorkflowId] = src.[ToWorkflowId]
    AND dest.[ToStatusId] = src.[ToStatusId]
WHEN MATCHED THEN
UPDATE
SET
    dest.[FromWorkflowId] = src.[FromWorkflowId]
    , dest.[FromStatusId] = src.[FromStatusId]
    , dest.[Action] = src.[Action]
    , dest.[ToWorkflowId] = src.[ToWorkflowId]
    , dest.[ToStatusId] = src.[ToStatusId]
    , dest.[ValidateTasks] = src.[ValidateTasks]
WHEN NOT MATCHED THEN
INSERT (
    [FromWorkflowId]
    , [FromStatusId]
    , [Action]
    , [ToWorkflowId]
    , [ToStatusId]
    , [ValidateTasks]
) VALUES (
    src.[FromWorkflowId]
    , src.[FromStatusId]
    , src.[Action]
    , src.[ToWorkflowId]
    , src.[ToStatusId]
    , src.[ValidateTasks]
);

