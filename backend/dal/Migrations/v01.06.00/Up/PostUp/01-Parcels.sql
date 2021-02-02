PRINT 'Update Parcels'

-- Update the parcel project number.
UPDATE p SET
    p.[ProjectNumbers] = '["' + b.[ProjectNumber] +'"]'
FROM dbo.[Parcels] p
INNER JOIN #Parcels b ON b.[Id] = p.[Id]

DROP TABLE #Parcels
