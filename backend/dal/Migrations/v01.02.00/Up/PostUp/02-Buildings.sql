PRINT 'Update Buildings - Copy LocalId into Name'

-- Copy the LocalId into the Name
-- If Name has a value and it is different than append it.
UPDATE b SET
    b.[Name] = lid.[LocalId] + ' ' + lid.[Name]
FROM dbo.[Buildings] b
INNER JOIN #Buildings lid ON b.[Id] = lid.[Id]
WHERE lid.[Name] != lid.[LocalId]
    AND (lid.[Name] IS NOT NULL OR lid.[Name] != '')

-- Replace Name with LocalId if it is null or empty.
UPDATE b SET
    b.[Name] = lid.[LocalId]
FROM dbo.[Buildings] b
INNER JOIN #Buildings lid ON b.[Id] = lid.[Id]
WHERE lid.[Name] IS NULL
    OR lid.[Name] = ''

DROP TABLE #Buildings
