PRINT 'Backup Addresses'

-- Create temporary table to store the City values
SELECT a.[Id]
    , aa.[Id] AS [CityId]
    , a.[AdministrativeArea] AS [City]
INTO #AddressCities
FROM dbo.[Addresses] a
INNER JOIN #AdministrativeAreas aa ON a.[AdministrativeArea] = aa.[Name]
