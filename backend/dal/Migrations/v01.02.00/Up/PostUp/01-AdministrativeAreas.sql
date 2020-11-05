PRINT 'Update AdministrativeAreas'

-- Copy the city name into the AdministrativeArea.
INSERT INTO dbo.[AdministrativeAreas] (
    [Name]
    , [Abbreviation]
)
SELECT
    [Name]
    , [Code]
FROM #Cities

DROP TABLE #Cities

-- Copy the municipality name into the AdministrativeArea.
INSERT INTO dbo.[AdministrativeAreas] (
    [Name]
    , [Abbreviation]
)
SELECT
    [Name]
    , [Name]
FROM #Municipalities

DROP TABLE #Municipalities
