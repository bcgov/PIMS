PRINT 'Update Parcels'

-- Reduce the length of the parcel name.
UPDATE p SET
    p.[Name] = LEFT(p.[Name], 150)
FROM dbo.[Parcels] p
