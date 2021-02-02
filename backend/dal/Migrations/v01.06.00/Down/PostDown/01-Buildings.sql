PRINT 'Update Buildings'

-- Update the buildings project number.
UPDATE p SET
    p.[ProjectNumber] = json_value(b.[ProjectNumbers], '$[0]')
FROM dbo.[Buildings] p
INNER JOIN #Buildings b ON b.[Id] = p.[Id]

DROP TABLE #Buildings
