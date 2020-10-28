PRINT 'Backup ParcelBuildings'

-- Create temporary table to store the relationship between parcel and buildings.
-- In this version a building can only be located on a single parcel.
SELECT DISTINCT 
    b.[Id] AS [BuildingId]
    , pb.[ParcelId]
    , p.[PID]
    , p.[PIN]
INTO #ParcelBuildings
FROM dbo.[Buildings] b
INNER JOIN dbo.[ParcelBuildings] pb on b.[Id] = pb.[BuildingId]
INNER JOIN dbo.[Parcels] p on pb.[ParcelId] = p.[Id]
