PRINT 'Update Buildings Locations'

-- Extract longitude and latitude from the location.
UPDATE b SET
    b.[Longitude] = b.[Location].Long
    , b.[Latitude] = b.[Location].Lat
FROM dbo.[Buildings] b

-- Make Location required.
ALTER TABLE dbo.[Buildings]
ALTER COLUMN
    [Latitude] FLOAT NOT NULL

ALTER TABLE dbo.[Buildings]
ALTER COLUMN
    [Longitude] FLOAT NOT NULL
