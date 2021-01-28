PRINT 'Backup Parcels'

-- Create temporary table to store the parcel values
SELECT
    p.[Id]
    , p.[ProjectNumber]
INTO #Parcels
FROM dbo.[Parcels] p
WHERE p.[ProjectNumber] IS NOT NULL
