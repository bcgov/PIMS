PRINT 'Update Addresses'

-- Copy the city name into the address.
UPDATE a SET
    a.[CityId] = ac.[CityId]
FROM dbo.[Addresses] a
INNER JOIN #AddressCities ac ON a.[Id] = ac.[Id]
WHERE a.[Id] = ac.[Id]

DROP TABLE #AddressCities
