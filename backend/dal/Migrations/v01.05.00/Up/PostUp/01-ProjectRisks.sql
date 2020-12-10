PRINT 'Update ProjectRisks'

-- Remove Completed, and shift the primary keys down.

-- Green will become Completed
UPDATE dbo.[Projects]
SET [RiskId] = 1
WHERE [RiskId] = 2

-- Yellow will become Green
UPDATE dbo.[Projects]
SET [RiskId] = 2
WHERE [RiskId] = 3

-- Red will become Yellow
UPDATE dbo.[Projects]
SET [RiskId] = 3
WHERE [RiskId] = 4

-- Remove Red
DELETE FROM dbo.[ProjectRisks]
WHERE [Id] = 4

-- Replace Yellow with Red
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'RED'
    , [Name] = 'Red'
    , [Description] = '0% of the property value'
WHERE [Id] = 3

-- Replace Green with Yellow
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'YELLOW'
    , [Name] = 'Yellow'
    , [Description] = '50% of the property value'
WHERE [Id] = 2

-- Replace Completed with Green
UPDATE dbo.[ProjectRisks]
SET
    [Code] = 'GREEN'
    , [Name] = 'Green'
    , [Description] = '90-100% of the property value'
WHERE [Id] = 1
