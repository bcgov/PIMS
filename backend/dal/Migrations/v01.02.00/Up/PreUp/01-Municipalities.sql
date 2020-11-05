PRINT 'Backup Municipalities'

-- Create temporary table to store the Municipality values
SELECT DISTINCT
    p.[Municipality] AS [Name]
INTO #Municipalities
FROM dbo.[Parcels] p
WHERE p.[Municipality] NOT IN (SELECT [Name] FROM #Cities)
