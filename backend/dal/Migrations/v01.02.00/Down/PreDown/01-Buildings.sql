PRINT 'Update Buildings'

-- Reduce the length of the building name.
UPDATE b SET
    b.[Name] = LEFT(b.[Name], 150)
FROM dbo.[Buildings] b
