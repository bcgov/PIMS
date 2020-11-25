PRINT 'Update Projects'

-- Update the project metadata.
UPDATE p SET
    p.[ExemptionRequested] = ISNULL(b.[ExemptionRequested], 0)
FROM dbo.[Projects] p
INNER JOIN #Projects b ON b.[Id] = p.[Id]

DROP TABLE #Projects

