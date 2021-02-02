PRINT 'Backup Parcels'

-- Create temporary table to store the parcel values
SELECT
    p.[Id]
    , p.[ProjectNumbers]
INTO #Parcels
FROM dbo.[Parcels] p
WHERE p.[ProjectNumbers] IS NOT NULL
