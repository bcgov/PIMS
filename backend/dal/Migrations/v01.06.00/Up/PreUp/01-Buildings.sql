PRINT 'Backup Buildings'

-- Create temporary table to store the building values
SELECT
    b.[Id]
    , b.[ProjectNumber]
INTO #Buildings
FROM dbo.[Buildings] b
WHERE b.[ProjectNumber] IS NOT NULL