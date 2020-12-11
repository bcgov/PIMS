PRINT 'Update ProjectRisks'

-- Replace Completed with Green
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'COMP'
    , [Name] = 'Complete'
    , [Description] = '100% of the property value'
WHERE [Id] = 1

-- Replace Completed with Green
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'GREEN'
    , [Name] = 'Green'
    , [Description] = '90% of the property value'
WHERE [Id] = 2

-- Replace Green with Yellow
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'YELLOW'
    , [Name] = 'Yellow'
    , [Description] = '50% of the property value'
WHERE [Id] = 3

SET IDENTITY_INSERT dbo.[ProjectRisks] ON

INSERT INTO dbo.[ProjectRisks] (
    [Id]
    , [Code]
    , [Name]
    , [Description]
    , [IsDisabled]
    , [SortOrder]
) VALUES (
    4
    , 'RED'
    , 'Red'
    , '0% of the property value'
    , 0
    , 4
)

SET IDENTITY_INSERT dbo.[ProjectRisks] OFF

-- Remove Completed, and shift the primary keys down.

-- Move Green
UPDATE dbo.[Projects]
SET [RiskId] = 2
WHERE [RiskId] = 1

-- Move Yellow
UPDATE dbo.[Projects]
SET [RiskId] = 3
WHERE [RiskId] = 2

-- Move Red
UPDATE dbo.[Projects]
SET [RiskId] = 4
WHERE [RiskId] = 3

