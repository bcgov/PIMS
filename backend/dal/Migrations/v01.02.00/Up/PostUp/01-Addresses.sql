PRINT 'Update Addresses'

-- Copy the city name into the AdministrativeArea.
UPDATE a SET
    a.[AdministrativeArea] = c.[Name]
FROM dbo.[Addresses] a
INNER JOIN #AddressCities c ON a.[Id] = c.[Id]

DROP TABLE #AddressCities
