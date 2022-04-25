PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL AP_!SPL -> Disposed'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 4
    AND [StatusId] = 32
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      4 -- ASSESS-EX-DISPOSAL
      , 32 -- Disposed
      , 1
      , 3
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 4
    AND [ToStatusId] = 32
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      4 -- ASSESS-EX-DISPOSAL
      , 22 -- AP_!SPL
      , 4 -- ASSESS-EX-DISPOSAL
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL !SPL -> T-GRE'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 4
    AND [StatusId] = 20
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      4 -- ASSESS-EX-DISPOSAL
      , 20 -- T-GRE
      , 1
      , 2
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 4
    AND [ToStatusId] = 20
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      4 -- ASSESS-EX-DISPOSAL
      , 22 -- AP_!SPL
      , 4 -- ASSESS-EX-DISPOSAL
      , 20 -- T-GRE
      , 'Transfer within GRE'
      , 0
  )
END


PRINT 'Adding ProjectStatusTransitions - ERP/!SPL -> Disposed'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 5
    AND [StatusId] = 32
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      5 -- ERP
      , 32 -- Disposed
      , 1
      , 6
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 5
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 32
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      5 -- ERP
      , 22 -- AP_!SPL
      , 5 -- ERP
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - ERP/!SPL -> T-GRE'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 5
    AND [StatusId] = 20
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      5 -- ERP
      , 20 -- T-GRE
      , 1
      , 5
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 5
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 20
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      5 -- ERP
      , 22 -- AP_!SPL
      , 5 -- ERP
      , 20 -- T-GRE
      , 'Transfer within GRE'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL/!SPL -> Disposed'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 32
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 32 -- Disposed
      , 1
      , 6
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 32
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      6 -- SPL
      , 22 -- AP_!SPL
      , 6 -- SPL
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL/!SPL -> T-GRE'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 20
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 20 -- T-GRE
      , 1
      , 5
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 20
  )
BEGIN
  INSERT INTO dbo.[ProjectStatusTransitions] (
      [FromWorkflowId]
      , [FromStatusId]
      , [ToWorkflowId]
      , [ToStatusId]
      , [Action]
      , [ValidateTasks]
  ) VALUES (
      6 -- SPL
      , 22 -- AP_!SPL
      , 6 -- SPL
      , 20 -- T-GRE
      , 'Transfer within GRE'
      , 0
  )
END
