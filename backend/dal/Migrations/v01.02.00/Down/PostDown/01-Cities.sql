PRINT 'Update Cities'

-- populate the cities.

SET IDENTITY_INSERT dbo.[Cities] ON

INSERT INTO dbo.[Cities] (
    [Id]
    , [Name]
    , [Code]
    , [IsDisabled]
)
SELECT
    [Id]
    , [Name]
    , [Code]
    , 0
FROM #AdministrativeAreas

DROP TABLE #AdministrativeAreas

SET IDENTITY_INSERT dbo.[Cities] OFF
