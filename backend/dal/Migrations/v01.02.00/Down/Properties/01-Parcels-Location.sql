PRINT 'Update Parcel Locations'

-- Extract longitude and latitude from the location.
UPDATE p SET
    p.[Longitude] = p.[Location].Long
    , p.[Latitude] = p.[Location].Lat
FROM dbo.[Parcels] p

-- Make Location required.
ALTER TABLE dbo.[Parcels]
ALTER COLUMN
    [Latitude] FLOAT NOT NULL

ALTER TABLE dbo.[Parcels]
ALTER COLUMN
    [Longitude] FLOAT NOT NULL
