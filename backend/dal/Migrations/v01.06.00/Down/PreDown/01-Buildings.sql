PRINT 'Backup Buildings'

-- Create temporary table to store the building values
SELECT
    b.[Id]
    , b.[ProjectNumbers]
INTO #Buildings
FROM dbo.[Buildings] b
WHERE b.[ProjectNumbers] IS NOT NULL