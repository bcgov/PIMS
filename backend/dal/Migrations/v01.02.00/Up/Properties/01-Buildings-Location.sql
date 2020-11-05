PRINT 'Update Buildings Locations'

-- Update the location.
UPDATE b SET
    b.[Location] = GEOGRAPHY::STPointFromText('POINT(' + CAST(b.Longitude AS NVARCHAR) + ' ' + CAST(b.Latitude AS NVARCHAR) + ')', 4326)
FROM dbo.[Buildings] b

-- Make Location required.
ALTER TABLE dbo.[Buildings]
ALTER COLUMN
    [Location] GEOGRAPHY NOT NULL
