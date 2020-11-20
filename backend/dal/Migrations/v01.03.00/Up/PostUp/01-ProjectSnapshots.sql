PRINT 'Update ProjectSnapshots'

-- Update the project snapshot metadata.
UPDATE p SET
    p.[Metadata] = b.[Metadata]
FROM dbo.[ProjectSnapshots] p
INNER JOIN #ProjectSnapshots b ON b.[Id] = p.[Id]

DROP TABLE #ProjectSnapshots
