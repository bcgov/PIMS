PRINT 'Update Parcels'

-- Update the parcels project number.
UPDATE p SET
    p.[ProjectNumber] = json_value(b.[ProjectNumbers], '$[0]')
FROM dbo.[Parcels] p
INNER JOIN #Parcels b ON b.[Id] = p.[Id]

DROP TABLE #Parcels
