PRINT 'Adding ProjectStatusTransitions - !SPL -> Disposed'

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
      5 -- SPL
      , 22 -- AP_!SPL
      , 5 -- ERP
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
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
      5 -- SPL
      , 22 -- AP_!SPL
      , 5 -- ERP
      , 20 -- T-GRE
      , 'Transfer within GRE'
      , 0
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
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
      4 -- ERP
      , 22 -- AP_!SPL
      , 5 -- ERP
      , 32 -- Disposed
      , 'Dispose Project'
      , 0
  )
END

IF NOT EXISTS (
  SELECT *
  FROM dbo.[ProjectStatusTransitions]
  WHERE [FromWorkflowId] = 4
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
      4 -- ERP
      , 22 -- AP_!SPL
      , 4 -- ERP
      , 20 -- T-GRE
      , 'Transfer within GRE'
      , 0
  )
END
