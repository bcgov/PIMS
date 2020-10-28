PRINT 'Update Parcels Locations'

-- Update the location.
UPDATE p SET
    p.[Location] = GEOGRAPHY::STPointFromText('POINT(' + CAST(p.Longitude AS NVARCHAR) + ' ' + CAST(p.Latitude AS NVARCHAR) + ')', 4326)
FROM dbo.[Parcels] p

-- Make Location required.
ALTER TABLE dbo.[Parcels]
ALTER COLUMN
    [Location] GEOGRAPHY NOT NULL
