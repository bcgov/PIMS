PRINT 'Removing duplicates'

DELETE FROM dbo.[AdministrativeAreas]
WHERE [Id] NOT IN (SELECT MIN(Id)
    FROM dbo.[AdministrativeAreas]
    GROUP BY [Name]
    HAVING MIN(Id) IS NOT NULL
)

