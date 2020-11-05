PRINT 'Backup Addresses'

-- Create temporary table to store the City values
SELECT a.[Id]
    , c.[Name]
INTO #AddressCities
FROM dbo.[Addresses] a
INNER JOIN dbo.[Cities] c ON a.[CityId] = c.[Id]
