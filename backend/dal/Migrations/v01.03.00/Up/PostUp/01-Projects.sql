PRINT 'Update Projects'

-- Update the project metadata.
UPDATE p SET
    p.[Metadata] = b.[Metadata]
FROM dbo.[Projects] p
INNER JOIN #Projects b ON b.[Id] = p.[Id]

DROP TABLE #Projects
