PRINT 'Add ParcelBuildings'

-- Add a record in the many-to-many table to link parcels with buildings.
INSERT INTO dbo.[ParcelBuildings] (
    [ParcelId]
    , [BuildingId]
)
SELECT
    [ParcelId]
    , [Id]
FROM #Buildings
