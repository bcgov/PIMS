PRINT 'Update Buildings'

-- Update the buildings project number.
UPDATE p SET
    p.[ProjectNumbers] = '["' + b.[ProjectNumber] +'"]'
FROM dbo.[Buildings] p
INNER JOIN #Buildings b ON b.[Id] = p.[Id]

DROP TABLE #Buildings
