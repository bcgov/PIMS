PRINT 'Update Buildings'

-- Update the building to be located on one parcel.
-- Regrettably we can only handle a one-to-many relationship in this version, so we choose order to get the oldest titled parcel.
UPDATE b SET
    b.[ParcelId] = (
        SELECT TOP 1 [ParcelId]
        FROM #ParcelBuildings
        WHERE [BuildingId] = b.[Id]
        ORDER BY [PID] DESC, [PIN])
FROM dbo.[Buildings] b

DROP TABLE #ParcelBuildings
