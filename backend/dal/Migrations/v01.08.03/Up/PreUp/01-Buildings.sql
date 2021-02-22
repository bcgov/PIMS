PRINT 'Update Buildings LeasedLandeMetadata'

-- Generate LeasedLandMetadata for buildings with land.
UPDATE b
SET b.[LeasedLandMetadata] = (
    SELECT
        _pb.[ParcelId]
        , 0 as Type
    FROM dbo.[ParcelBuildings] _pb
    WHERE b.[Id] = _pb.[BuildingId]
    FOR JSON AUTO
)
FROM dbo.[Buildings] b
INNER JOIN dbo.[ParcelBuildings] pb ON b.[Id] = pb.[BuildingId]
WHERE b.[LeasedLandMetadata] IS NULL

-- Generate LeasedLandMetadata for buildings without land
UPDATE b
SET b.[LeasedLandMetadata] = '[]'
FROM dbo.[Buildings] b
LEFT JOIN dbo.[ParcelBuildings] pb ON b.[Id] = pb.[BuildingId]
WHERE b.[LeasedLandMetadata] IS NULL
    AND pb.[ParcelId] IS NULL
