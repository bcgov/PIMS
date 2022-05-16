PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL -> Disposed'

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
      , 4
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
    AND [FromStatusId] = 15
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
      , 15 -- AP-EXE
      , 4 -- ASSESS-EX-DISPOSAL
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL AP-!SPL -> AP-ERP'

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
      , 14 -- AP-ERP
      , 1
      , 2
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 14
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
      , 22 -- AP-!SPL
      , 5 -- ERP
      , 14 -- AP-ERP
      , 'Approve for Enhanced Referral Process'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL AP-!SPL -> AP-SPL'

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
      , 21 -- AP-SPL
      , 1
      , 3
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 21
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
      , 22 -- AP-!SPL
      , 6 -- SPL
      , 21 -- AP-SPL
      , 'Approve for SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - ASSESS-EX-DISPOSAL AP-!SPL -> Cancelled'

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
      , 23 -- Cancelled
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
    AND [ToStatusId] = 23
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
      , 22 -- AP-!SPL
      , 4 -- ASSESS-EX-DISPOSAL
      , 23 -- Cancelled
      , 'Cancel Project'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL Market -> Pre-Market'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 40
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 40 -- PSL-PM
      , 1
      , 2
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 41
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 40
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
      , 41 -- PSL-M
      , 6 -- SPL
      , 40 -- PSL-PM
      , 'Return to Pre-Marketing'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL AP-SPL -> AP_!SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 22
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 22 -- AP_!SPL
      , 1
      , 6
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 21
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 22
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
      , 21 -- AP-SPL
      , 6 -- SPL
      , 22 -- AP_!SPL
      , 'Remove from SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL SPL-PM -> AP_!SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 40
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 22
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
      , 40 -- SPL-PM
      , 6 -- SPL
      , 22 -- AP_!SPL
      , 'Remove from SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL SPL-M -> AP_!SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 41
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 22
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
      , 41 -- SPL-M
      , 5 -- ERP
      , 22 -- AP-!SPL
      , 'Remove from SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL AP-!SPL -> AP-SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 21
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 21 -- AP-SPL
      , 1
      , 6
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 5
    AND [FromStatusId] = 22
    AND [ToWorkflowId] = 6
    AND [ToStatusId] = 21
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
      , 22 -- AP-!SPL
      , 6 -- SPL
      , 21 -- AP-SPL
      , 'Approved for SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL AP-!SPL -> AP-ERP'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[WorkflowProjectStatus]
  WHERE [WorkflowId] = 6
    AND [StatusId] = 14
)
BEGIN
  INSERT INTO dbo.[WorkflowProjectStatus] (
    [WorkflowId]
    , [StatusId]
    , [IsOptional]
    , [SortOrder]
  ) VALUES (
      6 -- SPL
      , 14 -- AP-ERP
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
    AND [ToStatusId] = 14
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
      , 22 -- AP-!SPL
      , 5 -- ERP
      , 14 -- AP-ERP
      , 'Approved for ERP'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - AP-SPL -> AP-!SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 21
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 22
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
      , 21 -- AP-SPL
      , 5 -- ERP
      , 22 -- AP-!SPL
      , 'Remove from SPL'
      , 0
  )
END

PRINT 'Adding ProjectStatusTransitions - SPL-PM -> AP-!SPL'

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 6
    AND [FromStatusId] = 40
    AND [ToWorkflowId] = 5
    AND [ToStatusId] = 22
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
      , 40 -- SPL-PM
      , 5 -- ERP
      , 22 -- AP-!SPL
      , 'Remove from SPL'
      , 0
  )
END

PRINT 'Transition any SPL AP-!SPL -> ERP AP-!SPL'

UPDATE dbo.[Projects]
SET [WorkflowId] = 5 -- ERP
WHERE [WorkflowId] = 6 -- SPL
  AND [StatusId] = 22 -- AP-!SPL

PRINT 'Remove ProjectStatusTransitions - ANYTHING -> SPL AP-!SPL'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [ToWorkflowId] = 6 -- SPL
  AND [ToStatusId] = 22 -- AP-!SPL

PRINT 'Remove ProjectStatusTransitions - SPL AP-!SPL -> ANYTHING'

DELETE FROM dbo.[ProjectStatusTransitions]
WHERE [FromWorkflowId] = 6 -- SPL
  AND [FromStatusId] = 22 -- AP-!SPL
