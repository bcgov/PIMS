PRINT 'Removing duplicates'

DELETE FROM dbo.[AdministrativeAreas]
WHERE [Id] NOT IN (SELECT MAX(Id)
    FROM dbo.[AdministrativeAreas]
    GROUP BY [Name]
    HAVING MAX(Id) IS NOT NULL
)

